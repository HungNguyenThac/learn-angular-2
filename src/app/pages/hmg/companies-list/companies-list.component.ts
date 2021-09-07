import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit {
  companiesList = [
    {
      name:"CTCP Đầu tư và Công nghệ Việt Nam",
      brand:"brand-epay",
    },
    {
      name:"CTCP Chứng khoán Alpha",
      brand:"brand-alpha",
    },
    {
      name:"CTCP Đầu tư và Thương mại TNG",
      brand:"brand-tng",
    },
    {
      name:"CTCP Tập đoàn Hoàng Minh",
      brand:"brand-hmg",
    },
    {
      name:"CTCP Vật liệu xây dựng Hà Nội",
      brand:"brand-cmc",
    },
    {
      name:"CTCP Xuất nhập khẩu Nông sản Thực phẩm An Giang",
      brand:"brand-afiex",
    },
    {
      name:"CTCP Đầu tư Ego Việt Nam ",
      brand:"brand-ego-farm",
    },
    
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
