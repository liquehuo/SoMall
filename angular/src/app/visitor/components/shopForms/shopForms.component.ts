import { Component, OnInit } from '@angular/core';
import { FormProxyService, FormDto, WeixinProxyService, ShopDto, FormTheme } from 'src/api/appService';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FormEditComponent } from '../form-edit/form-edit.component';
import { ActivatedRoute } from '@angular/router';
import { ShopSelectComponent } from '../shop-select/shop-select.component';

@Component({
  selector: 'app-shop-forms',
  templateUrl: './shopForms.component.html'
})
export class ShopFormsComponent implements OnInit {
  formId: string;
  dataItems: any[] = [];
  pageingInfo = {
    totalItems: 0,
    pageNumber: 0,
    pageSize: 0,
    isTableLoading: false
  };
  constructor(
    private api: FormProxyService,
    private weixinApi: WeixinProxyService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      console.log(params)
      this.formId = params.params.formid
      this.refresh();
    });

  }

  refresh() {
    this.pageingInfo.isTableLoading = true;
    this.api.getShops({ id: this.formId }).subscribe(res => {
      console.log(res);
      this.dataItems = res;
      this.pageingInfo.isTableLoading = false;
    })
  }

  addShop() {
    const modal = this.modalService.create({
      nzTitle: '添加商户',
      nzContent: ShopSelectComponent,
      nzComponentParams: {
        // form: {
        //   title: "",
        //   description: "",
        //   theme: FormTheme.red
        // }
      },
      nzFooter: [
        {
          label: '确定',
          onClick: instance => {

          }
        }
      ]
    });
    modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));
  }


  delete(shop: FormDto) {
    this.api.delete(shop).subscribe(res => {
      this.message.success("删除成功");
      this.refresh();
    })
  }

  isVisible = false;
  qrSrc = "";
  qrTitle = "";

  getQr(shop: ShopDto) {
    console.log(shop);

    this.qrSrc = "";
    this.qrTitle = `${shop.name} 小程序码`;
    this.weixinApi.getUnLimitQr({ scene: `${shop.id}` }).subscribe(res => {
      console.log(res);
      this.qrSrc = `http://${res.url}`;
      this.isVisible = true;
    })
  }

  handleCancel() { this.isVisible = false; }
}
