import { Component, OnInit } from '@angular/core';

interface Payment {
  date:string;
  name:string;
  amount:string;
  detail:string;
  pdfLink:string;
}
@Component({
  selector: 'app-topup-history',
  templateUrl: './topup-history.component.html',
  styleUrls: ['./topup-history.component.scss']
})
export class TopupHistoryComponent  {

  payments: Payment [] = [
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
    {date: '2023-04-06 17:00', name: 'ธนาคารกสิกรไทย (KBANK)',amount: '5,000' , detail: 'ชำระค่าแพ็จเกจ', pdfLink: 'www.google.com'},
  ];
}

