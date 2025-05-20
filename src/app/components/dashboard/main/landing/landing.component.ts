import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LandingService } from '../servicesApi/landing.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { WINDOW, WindowProvider } from '../../../../shared/Providers/window-provider.service';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ToastModule, FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [WindowProvider,MessageService]
})
export class LandingComponent implements OnInit {

  currentLang: string;
  contractsList: any[]=[];
  notifications: any[] = [];  
  userData: any;

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private landingService: LandingService,
    @Inject(WINDOW) private _window: Window
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    let data = localStorage.getItem("userData")
    this.userData = data ? JSON.parse(data) : {};
  }
    printPmContractDataList:any=[];

  ngOnInit(): void {
    this.getContracts();
    this.Getnotifications();

  }

  routeTo(link: string) {
    this.router.navigate([link]);
  }
  getContracts() {
    let userId = null; // تعيين قيمة افتراضية

    const userData = localStorage.getItem('userData');
    //const id = 46 ;

    if (userData) {
      try {
        userId = JSON.parse(userData)?.userId;
      } catch (e) {
        console.error('Error parsing userData from localStorage', e);
      }
    }


    this._SpinnerService.showSpinner();
    this.landingService.getPayments({ Id: userId }).subscribe({
      next: (res) => {
        console.log(res);
        this._SpinnerService.hideSpinner();
        this.contractsList = res.result?.items;
      },
      error: (error) => {
        this._SpinnerService.hideSpinner();

      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    })
  };
  Getnotifications() {
    this._SpinnerService.showSpinner();
    const hostname = this._window.location.hostname;
    const tenancyName = hostname.includes('localhost') ? 'compassint' : hostname.split('.')[0];

    this.landingService.Getnotifications({ tenancyName,userId:this.userData.userId}).subscribe({
      next: (res) => {
        this._SpinnerService.hideSpinner();
  
        if (res.success && res.result) {
          this.notifications = res.result.map((item: any) => {
            const props = item.notification.data.properties || {};
            return {
               message: props.Message || '',
               date: props.Date || '',
               id: props.id || '',
               number: props.number || ''

              // date: item.notification.creationTime
            };
          });
        }
      },
      error: () => {
        this._SpinnerService.hideSpinner();
      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    });
  }

  getStatusClass(status: any): string {
    console.log("status = ", status);

    if (!status) {
      return ''; // If status is not available, return empty
    }

    // Check the status and return the corresponding class
    switch (status) {
      case 'Posted':
        return 'status-green';
      case 'Renew':
        return 'status-renew';
      case 'New':
        return 'status-yellow';
      case 'Canceled':
        return 'status-red';
      default:
        return '';
    }
  }

  renewContract(id: any) {
      
    let userId = null; // تعيين قيمة افتراضية
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        userId = JSON.parse(userData)?.userId;
      } catch (e) {
        console.error('Error parsing userData from localStorage', e);
      }
    }

    console.log(id);
    this._SpinnerService.showSpinner();
    this.landingService.renewContract({ id: id, userId: userId }).subscribe({
      next: (res) => {
        console.log(res);
        this._SpinnerService.hideSpinner();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${res?.result?.reason === "يجب أن يكون السند مرحل" ? "The Contract must be posted" :"The Contract renew Successfully"}`,
        })
        this.getContracts();
      },
      error: (err) => {
        console.log(err);
        this._SpinnerService.hideSpinner();

      }
    })
  };
onRenewClick(event: Event, contractId: number): void {
  event.stopPropagation();
  this.selectedContractId = contractId;
}
  routeToDetails(arg0: any) {
    this.router.navigate(['/Main/Contract'], { queryParams: { currentItemCollapsed: arg0 } });
  }
selectedContractId: number | null = null;


confirmRenewAction(): void {
  if (this.selectedContractId !== null) {
    this.renewContract(this.selectedContractId);
    this.selectedContractId = null;
  }
}

printPmContractData(event:Event,id: any) {
  event.stopPropagation();
      this._SpinnerService.showSpinner();

  const lang = localStorage.getItem('lang') || 'en';
  this.landingService.printPmContract(id , lang).subscribe(
    (result) => {
      console.log(result);
      if (result?.success && result.result) {
        this.printPmContractDataList = Array.isArray(result.result) ? result.result : [result.result];
        
        this.openPrintPreview();
       this._SpinnerService.hideSpinner();

      }
    },
    (error) => {
      console.error('Error fetching contract data:', error);
    }
  );
}
openPrintPreview() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  const pmcontract = this.printPmContractDataList[0]; 
const contractStartDate = (pmcontract.contractStartDate || '').split('T')[0];
const contractEndDate = (pmcontract.contractEndDate || '').split('T')[0];
const paymentRows = this.printPmContractDataList.map((pmcontract: { payType: any; payNumber: any; payDate: any; }, index: number) => {
  const payDate = pmcontract.payDate ? new Date(pmcontract.payDate).toISOString().split('T')[0] : '';
  return `
    <tr>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #000; padding: 8px;">${pmcontract.payType || ''}</td>
      <td style="border: 1px solid #000; padding: 8px;">${pmcontract.payNumber || ''}</td>
      <td style="border: 1px solid #000; padding: 8px;">${payDate}</td>
      <td style="border: 1px solid #000; padding: 8px;"></td>
    </tr>
  `;
}).join('');

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rental Contract</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      direction: rtl;
      margin: 30px;
    }
    .page {
      page-break-after: always;
    }
    h2 {
      text-align: center;
      margin-bottom: 30px;
    }
    .section-title {
      background: #f0f0f0;
      font-weight: bold;
      padding: 8px;
      margin-bottom: 10px;
    }
    .section-row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 25px;
    }
    .section-table {
      width: 49%;
      border-collapse: collapse;
    }
    .section-table th,
    .section-table td {
      border: 1px solid #000;
      padding: 8px;
      font-size: 14px;
    }
    .section-table th {
      background: #e8e8e8;
    }
    ol {
      padding-right: 20px;
      font-size: 14px;
    }
    @media print {
      body {
        margin: 0;
      }
    }
  </style>
</head>
<body>
<!-- Page 1 -->
<div class="page">
  <h2>عقد إيجار (وحدة عقارية) / RENTAL CONTRACT</h2>
  <div class="section-title">Landlord Info / بيانات المؤجر &nbsp; | &nbsp; Tenant Info / بيانات المستأجر</div>
  <div class="section-row">
    <table class="section-table">
      <tr><th>اسم المالك</th><td>${pmcontract.ownerName || ''}</td><th>Owner Name</th></tr>
      <tr><th>اسم المالك</th><td>${pmcontract.ownerName || ''}</td><th>Name of Landlord</th></tr>
      <tr><th>الجنسية</th><td>${pmcontract.ownerNationalityName || ''}</td><th>Nationality</th></tr>
      <tr><th>رقم الهوية</th><td>${pmcontract.ownerIdNumber || ''}</td><th>Emirates ID</th></tr>
      <tr><th>العنوان</th><td>${pmcontract.ownerAddress || ''}</td><th>Address</th></tr>
      <tr><th>ص.ب</th><td>${pmcontract.ownerPoBox || ''}</td><th>P.O. Box</th></tr>
      <tr><th>البريد الإلكتروني</th><td>${pmcontract.ownerEmailAddress || ''}</td><th>Email</th></tr>
    </table>
    <table class="section-table">
      <tr><th>اسم المستأجر</th><td>${pmcontract.tenantName || ''}</td><th>Tenant Name</th></tr>
      <tr><th>الجنسية</th><td>${pmcontract.tenantNationalityName || ''}</td><th>Nationality</th></tr>
      <tr><th>رقم الهوية</th><td>${pmcontract.tenantIdNumber || ''}</td><th>Emirates ID</th></tr>
      <tr><th>الهاتف</th><td>${pmcontract.tenantHomePhoneNumber || ''}</td><th>Phone</th></tr>
      <tr><th>ص.ب</th><td>${pmcontract.tenantAddress || ''}</td><th>P.O. Box</th></tr>
      <tr><th>البريد الإلكتروني</th><td>${pmcontract.tenantEmailAddress || ''}</td><th>Email</th></tr>
    </table>
  </div>
  <div class="section-title">Leased Property Info / بيانات العين المؤجرة &nbsp; | &nbsp; Lease Info / بيانات الإيجار</div>
  <div class="section-row">
    <table class="section-table">
      <tr><th>المنطقة</th><td>${pmcontract.region || ''}</td><th>Area</th></tr>
      <tr><th>رقم الوحدة العقارية</th><td>${pmcontract.unitNo || ''}</td><th>Property Unit No</th></tr>
      <tr><th>جمال</th><td>${pmcontract.electricityNumber || ''}</td><th>Fewa</th></tr>
      <tr><th>العنوان</th><td>${pmcontract.propertiesAddress || ''}</td><th>Address</th></tr>
      <tr><th>نوع العقار</th><td>${pmcontract.unitTypeName || ''}</td><th>Property Type</th></tr>
      <tr><th>اسم المبنى</th><td>${pmcontract.propertyName || ''}</td><th>Building Name</th></tr>
      <tr><th>الوصف</th><td>${pmcontract.pmUnitDesc || ''}</td><th>Property Desc</th></tr>
      <tr><th>الطابق</th><td>${pmcontract.floorLevel || ''}</td><th>Floor No</th></tr>
      <tr><th>رقم الأرض</th><td>${pmcontract.landNumber || ''}</td><th>Land No</th></tr>
    </table>
    <table class="section-table">
      <tr><th>غرض الاستخدام</th><td>${pmcontract.activityName || ''}</td><th>Purpose of Usage</th></tr>
      <tr><th>مدة الإيجار</th><td>${pmcontract.rentPeriod || ''}</td><th>Rent Duration</th></tr>
      <tr><th>تاريخ الإيجار</th><td>${contractStartDate || ''}</td><th>Date of Tenancy</th></tr>
      <tr><th>تاريخ انتهاء عقد الإيجار</th><td>${contractEndDate || ''}</td><th>Tenancy Expiry Date</th></tr>
      <tr><th>مبلغ الإيجار</th><td>${pmcontract.rentAMOUNT || ''}</td><th>Rent Amount</th></tr>
      <tr><th>مبلغ التأمين</th><td>${pmcontract.insuranceAmount || ''}</td><th> Insurance Amount</th></tr>
      <tr><th>منطقة العقار</th><td>${pmcontract.areaSize || ''}</td><th>Property Area Sq.M</th></tr>
    </table>
  </div>
<div class="page">
  <h2>عقد إيجار (وحدة عقارية) / RENTAL CONTRACT</h2>
  <p style="display: flex; justify-content: space-between;">
    <span style="width: 45%; text-align: right;">
      بموجب هذا العقد يوافق المؤجر على تأجير العقار الموصوف أعلاه وللمدة المحددة أعلاه للمستأجر وذلك حسب الشروط التالية:<br>
      تعتبر البيانات الواردة أعلاه بمثابة أنها جزء لا يتجزأ من أحكام هذا العقد.<br>
      يقر الطرفان بأنهما قد أطلعا على أحكام القانون رقم (3) لسنة 2008 بشأن تنظيم العلاقة بين مؤجري ومستأجري العقارات في إمارة أم القيوين وأنهما وبموجب هذا العقد يقبلان صراحة التقيد التام بالالتزامات التي قررها القانون المذكور على كل من المؤجر والمستأجر.
    </span>
    <span style="width: 45%; text-align: left;">
      The Landlord hereby agrees to rent the property described herein above for the prescribed period to the Tenant in accordance with the following conditions:<br>
      The above preamble is deemed as an integral part of terms hereof.<br>
      The Parties hereto hereby acknowledge that they have read the Provisions of Law No. (3) Of 2008 which regulates the relationship between Landlords and Tenants in the Emirate of Umm Al Quwain and they hereby accept to comply with all obligations of the Landlord and Tenant prescribed by the Law.
    </span>
  </p>
<!-- Page 2 -->
  <h2>شروط العقد العامة / Conditions of Contract</h2>
  <ol>
    <li style="display: flex; justify-content: space-between;">
      <span style="width: 45%; text-align: right;">
       بموجب هذا العقد يقر الطرف الثاني بأنه قد قام بمعاينة العقار المؤجر وأنه قد قبله بحالته الراهنة.<br>
      </span>
      <span style="width: 45%; text-align: left;">
       The Tenant hereby admits to have inspected the leased property and has accepted in its present condition.<br>
      </span>
    </li>
    <li style="display: flex; justify-content: space-between;">
      <span style="width: 45%; text-align: right;">
       لا يجوز للمستأجر إدخال أي تعديلات أو هدم أي جزء من العقار المؤجر أو التنازل عن إيجاره دون الحصول على موافقة مسبقة وخطية من المؤجر.<br>
      </span>
      <span style="width: 45%; text-align: left;">
       The Tenant shall not modify or demolish any part of the leased property or sublease the same without the prior written consent of The Landlord.<br>
      </span>
    </li>
    <li style="display: flex; justify-content: space-between;">
      <span style="width: 45%; text-align: right;">
       يتعهد المستأجر بتسديد جميع رسوم وتكاليف استهلاكه من الكهرباء والماء واستعمال الهاتف والفاكس والتلكس وغيره.<br>
      </span>
      <span style="width: 45%; text-align: left;">
       The Tenant hereby undertakes to pay the cost of his consumption of electricity, water, telephone, fax, telex, bills, etc.<br>
      </span>
    </li>
    <li style="display: flex; justify-content: space-between;">
      <span style="width: 45%; text-align: right;">
       في حالة نشوء أي مسألة لم يتم النص عليها صراحة ضمن الشروط الخاصة في هذا العقد أو ضمن أحكام قانون الإيجارات فتطبق بشأنها أحكام النصوص العامة في قانون المعاملات المدنية الساري.<br>
      </span>
      <span style="width: 45%; text-align: left;">
       In case any issue is not expressly provided for, the same shall be resolved under the general provisions of the UAE Civil Code.<br>
      </span>
    </li>
    <li style="display: flex; justify-content: space-between;">
      <span style="width: 45%; text-align: right;">
       يلتزم المؤجر والمستأجر بالقوانين والتنظيمات الخاصة بهدم المباني الآيلة للسقوط وأماكن سكن العمال.<br>
      </span>
      <span style="width: 45%; text-align: left;">
       The lessor and the lessee are committed to the laws and regulations on demolition of collapsing buildings and designated worker housing zones.<br>
      </span>
    </li>
    <li style="display: flex; justify-content: space-between;">
      <span style="width: 45%; text-align: right;">
       أي إخطار بتجديد العقد أو عدم الرغبة في تجديده أو طلب زيادة البدل أو إنقاصه لابد وأن يتم قبل ثلاثة أشهر من تاريخ انتهاء عقد الإيجار القائم.<br>
      </span>
      <span style="width: 45%; text-align: left;">
       Any notice to renew or not renew the contract, or request for rent adjustment, must be given three months before expiry.<br>
      </span>
    </li>
  </ol>

<div class="section-title" style="background: #cce6f7; padding: 8px; font-weight: bold; text-align: right;">
  شروط العقد الخاصة
</div>
<ol style="list-style: none; padding-right: 0; font-size: 14px;">
  <li style="margin-bottom: 10px;">-1 <u>${pmcontract.condition1 || ''}</u></li>
  <li style="margin-bottom: 10px;">-2 <u>${pmcontract.condition2 || ''}</u></li>
  <li style="margin-bottom: 10px;">-3 <u>${pmcontract.condition3 || ''}</u></li>
  <li style="margin-bottom: 10px;">-4 <u>${pmcontract.condition4 || ''}</u></li>
  <li style="margin-bottom: 10px;">-5 <u>${pmcontract.condition5 || ''}</u></li>
</ol>
<!-- Payment Details Table -->
 <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
      <thead>
        <tr style="background-color: #cce6f7; text-align: center;">
          <th style="border: 1px solid #000; padding: 8px;">الرقم</th>
          <th style="border: 1px solid #000; padding: 8px;">نقداً / شيك</th>
          <th style="border: 1px solid #000; padding: 8px;">رقم الإيصال</th>
          <th style="border: 1px solid #000; padding: 8px;">التاريخ</th>
          <th style="border: 1px solid #000; padding: 8px;">التوقيع بالاستلام</th>
        </tr>
      </thead>
      <tbody>
        ${paymentRows}
      </tbody>
    </table>
</div>
<!-- Page 3 -->
<div class="page">
  <div style="display: flex; justify-content: space-between; margin-top: 80px; font-size: 14px;">
    <div style="width: 45%; text-align: right;">
      <p>توقيع الطرف الأول / Signature of First Party  (مالك/Owner)</p>
      <div style="height: 60px; border-bottom: 1px solid #000;"></div>
      <p>التاريخ: ______ / ______ / __________</p>
    </div>
    <div style="width: 45%; text-align: left;">
      <p>توقيع الطرف الثاني / Signature of Second Party (مستأجر/Tenant)</p>
      <div style="height: 60px; border-bottom: 1px solid #000;"></div>
      <p>Date: __________ / __________ / __________</p>
    </div>
  </div>
  <div style="display: flex; justify-content: space-between; margin-top: 80px; font-size: 14px;">
    <div style="width: 45%; text-align: right;">
      <p>توقيع المستأجر:</p>
      <div style="height: 60px; border-bottom: 1px solid #000;"></div>
      <p>الاسم: ____________________________</p>
      <p>التاريخ: ______ / ______ / __________</p>
    </div>
 
  </div>
  <div style="margin-top: 100px; font-size: 12px; text-align: center; border-top: 1px solid #ccc; padding-top: 10px;">
    <p>هذا العقد محرر من نسختين يحتفظ كل طرف بنسخة للعمل بموجبها / This contract is made in two copies, each party shall retain one to act upon.</p>
  </div>
</div>
</body>
</html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

NewprintPmContractData(event:Event,id: any) {
    event.stopPropagation();

      this._SpinnerService.showSpinner();

  const lang = localStorage.getItem('lang') || 'en';
  this.landingService.printPmContract(id , lang).subscribe(
    (result) => {
      console.log(result);
      if (result?.success && result.result) {
        this.printPmContractDataList = Array.isArray(result.result) ? result.result : [result.result];
        
        this.NewopenPrintPreview();
       this._SpinnerService.hideSpinner();

      }
    },
    (error) => {
      console.error('Error fetching contract data:', error);
    }
  );
}
NewopenPrintPreview() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  const pmcontract = this.printPmContractDataList[0]; 
const contractStartDate = (pmcontract.contractStartDate || '').split('T')[0];
const contractEndDate = (pmcontract.contractEndDate || '').split('T')[0];
const paymentRows = this.printPmContractDataList.map((pmcontract: { payType: any; payNumber: any; payDate: any; }, index: number) => {
  const payDate = pmcontract.payDate ? new Date(pmcontract.payDate).toISOString().split('T')[0] : '';
  return `

  <tr>
     <td> </td>
    <td>${payDate}</td>
    <td> ${pmcontract.payNumber || ''}</td>
    <td> ${pmcontract.payType || ''}</td>
    <td>${index + 1}</td>
   </tr> 
  `;
}).join('');

  printWindow.document.write(`
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rental Contract</title>

    <style>
        .bold {
            font-weight: bold;
            font-family: Arial !important;
        }

        h1,
        h2,
        h3,
        h4,
        p,
        label,
        th,
        td {
            font-family: Arial !important;
        }

        .header {
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
        }

        section {
            width: 1024px;
            height: 1420px;
            margin: auto;
            padding-top: 24px;
        }

        body {
            padding: 0;
            margin: 0;
        }

        .main-img {
            width: 1024px;
            height: 590px;
            display: flex;
            justify-content: space-between;
        }

        .list-container {
            display: flex;
            gap: 32px;
            margin-bottom: 16px;
        }

        .list-container:last-child {

            margin-bottom: 0;
        }

        .list-container p {
            width: 50%;
            margin-top: 0;
            margin-bottom: 0;
        }

        th,
        td {
            text-align: start;
            padding: 16px 0;
            border-bottom: 1px solid #e1e1e1;
        }

        th {
            color: #844C88;
        }

        td {
            color: #636363;
        }

        table {
            width: 100%;
        }



        .invoce-section p,
        .invoce-section span,
        .invoce-section td {
            margin-bottom: 8px;
            margin-top: 8px;
            font-size: 16px !important;
        }

        .table-border {
            border-spacing: 1px;
        }

        .table-border td {
            text-align: start;
            padding: 8px;
            border: 1px solid #e1e1e1;
            width: 25%;
        }

        .m-0 {
            margin: 0;
        }

        .label {
            width: 30%;
        }

        .value {
            width: 60%;
            text-align: center;
            color: #464646;
        }

        p:last-child {
            direction: rtl;
        }

        .Conditions {
            width: 45%;
        }

        .black {
            color: black;
        }

        @media print {

        .break-after{
              page-break-after: always; /* fallback */
             break-after: page;
         }

          .break-before{
             page-break-before: always; /* fallback */
              break-before: page;
         }

        }


    </style>

</head>

<body>

    <section class="invoce-section">
        <div style="padding:0 32px;">
            <div style="display:flex; justify-content:center">
                               <img style="width: 200px;" src="data:image/png;base64,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" />

            </div>

            <h1 style="text-align:center; font-size:42px; margin:24px 0;">

                عقد ايجار

                (وحدة عقارية)

                <br>
                RENTAL CONTRACT

            </h1>

            <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 24px;border-radius: 10px;">

                <div
                    style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: space-between; border-radius: 5px;">
                    <h2 class="bold m-0"> Info Tenant </h2>
                    <h2 class="bold m-0">بيانات المستأجر </h2>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Tenant Name </p>
                    <p class="value">${pmcontract.tenantName || ''} </p>
                    <p class="bold label">اسم المستأجر </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Nationality </p>
                    <p class="value">${pmcontract.tenantNationalityName || ''} </p>
                    <p class="bold label">الجنسية </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Emirates ID </p>
                    <p class="value">${pmcontract.tenantIdNumber || ''}</p>
                    <p class="bold label">رقم بطاقة الهوية </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Phone </p>
                    <p class="value">${pmcontract.tenantHomePhoneNumber || ''} </p>
                    <p class="bold label">الهاتف </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">P.O. Box </p>
                    <p class="value">${pmcontract.tenantAddress || ''}</p>
                    <p class="bold label">صندوق البريد </p>
                </div>
                <div style="padding:8px 16px;   display: flex; justify-content: space-between;">
                    <p class="bold label">Email </p>
                    <p class="value">${pmcontract.tenantEmailAddress || ''}</p>
                    <p class="bold label">البريد اللكتروني </p>
                </div>



            </div>

            <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 24px;border-radius: 10px;">

                <div
                    style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: space-between; border-radius: 5px;">
                    <h2 class="bold m-0"> Landlord Info</h2>
                    <h2 class="bold m-0"> بيانات المؤجر </h2>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Owner Name </p>
                    <p class="value">${pmcontract.ownerName || ''} </p>
                    <p class="bold label">اسم المالك </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Name of Landlord </p>
                    <p class="value">${pmcontract.ownerName || ''} </p>
                    <p class="bold label">اسم المؤجر </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Nationality </p>
                    <p class="value">${pmcontract.ownerNationalityName || ''}</p>
                    <p class="bold label">الجنسية </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Emirates ID </p>
                    <p class="value">${pmcontract.ownerIdNumber || ''} </p>
                    <p class="bold label">رقم بطاقة الهوية </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Address </p>
                    <p class="value">${pmcontract.ownerAddress || ''}</p>
                    <p class="bold label">العنوان </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Phone </p>
                    <p class="value">${pmcontract.ownerHomePhoneNumber || ''}</p>
                    <p class="bold label">الهاتف </p>
                </div>

                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">P.O. Box </p>
                    <p class="value">${pmcontract.ownerPoBox || ''}</p>
                    <p class="bold label">صندوق البريد </p>
                </div>
                <div style="padding:8px 16px;   display: flex; justify-content: space-between;">
                    <p class="bold label">Email </p>
                    <p class="value">${pmcontract.ownerEmailAddress || ''}</p>
                    <p class="bold label">البريد اللكتروني </p>
                </div>


            </div>

            <div class="break-after"></div>

            <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 24px;border-radius: 10px;">
            
                <div
                    style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: space-between; border-radius: 5px;">
                    <h2 class="bold m-0">Lease Info </h2>
                    <h2 class="bold m-0"> بيانات اليجار </h2>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Purpose of Usage </p>
                    <p class="value">${pmcontract.activityName || ''}</p>
                    <p class="bold label">الغرض من
    اليجار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Rent Duration </p>
                    <p class="value">${pmcontract.rentPeriod || ''}</p>
                    <p class="bold label">مدة اليجار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Date of Tenancy </p>
                    <p class="value">${contractStartDate || ''}</p>
                    <p class="bold label">بداية تاريخ عقد
                        اليجار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Tenancy Expiry  Date  </p>
                    <p class="value">${contractEndDate || ''}</p>
                    <p class="bold label">نهاية تاريخ عقد
                        اليجار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Rent Amount </p>
                    <p class="value">${pmcontract.rentAMOUNT || ''}</p>
                    <p class="bold label">قيمة عقد اليجار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Insurance Amount </p>
                    <p class="value">${pmcontract.insuranceAmount || ''}</p>
                    <p class="bold label">مبلغ التأمين </p>
                </div>


                <div style="padding:8px 16px;   display: flex; justify-content: space-between;">
                    <p class="bold label">Property Area Sq.M </p>
                    <p class="value">${pmcontract.areaSize || ''}</p>
                    <p class="bold label">مساحة العقار </p>
                </div>



            </div>

            <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 24px;border-radius: 10px;">

                <div
                    style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: space-between; border-radius: 5px;">
                    <h2 class="bold m-0">Property Leased Info </h2>
                    <h2 class="bold m-0"> بيانات العين المؤجرة </h2>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Area </p>
                    <p class="value">${pmcontract.region || ''} </p>
                    <p class="bold label">المنطقة </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Property Unit No</p>
                    <p class="value">${pmcontract.unitNo || ''}</p>
                    <p class="bold label">رقم الوحدة العقارية </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Fewa </p>
                    <p class="value">${pmcontract.electricityNumber || ''} </p>
                    <p class="bold label">رقم حساب الكهرباء </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Address </p>
                    <p class="value">${pmcontract.propertiesAddress || ''}</p>
                    <p class="bold label">العنوان </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Property Type </p>
                    <p class="value">${pmcontract.unitTypeName || ''} </p>
                    <p class="bold label">نوع العقار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Building Name </p>
                    <p class="value">${pmcontract.propertyName || ''}</p>
                    <p class="bold label">اسم المبنى </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Property Description </p>
                    <p class="value">${pmcontract.pmUnitDesc || ''} </p>
                    <p class="bold label">وصف العقار </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label">Floor No. </p>
                    <p class="value">${pmcontract.floorLevel || ''} </p>
                    <p class="bold label">رقم الطابق </p>
                </div>
                <div style="padding:8px 16px;   display: flex; justify-content: space-between;">
                    <p class="bold label">Land No. </p>
                    <p class="value">${pmcontract.landNumber || ''} </p>
                    <p class="bold label">رقم الرض </p>
                </div>



            </div>

            <div>

                <h4 style="margin-bottom: 24px; font-weight: 500;">The Landlord hereby agrees to rent property described
                    herein above for the prescribed period to the Tenant in
                    accordance with the following conditions:
                    The above preamble is deemed as an integral part of terms
                    hereof.
                    <br>
                    The Parties hereto hereby acknowledge that they have read
                    the Provisions of Law No. )3( Of 2008 which regulates the
                    relationship between Landlords and Tenants in the Emirates
                    of Umm Al Quwain and they hereby accepts to comply with
                    all obligations of the Landlord and Tenant Prescribed by the
                    Law.
                </h4>
                <h4 style="text-align: end; font-weight: 500;">
                    بموجب هذا العقد يوافق المؤجر على تأجير العقار الموصوف أعله
                    وللمدة المحددة أعله للمستأجر وذلك حسب الشروط التالية:
                    تعتبر البيانات الواردة أعله بمثابة أنها جزءا ل يتجزأ من أحكام هذ العقد.
                    يقر الطرفان بأنهما قد أطلعا على أحكام القانون رقم )3( لسنة 2008
                    بشأن تنظيم العلقة بين مؤجري ومستأجري العقارات في إمارة أم القيوين
                    وأنهما وبموجب هذا العقد يقبلن صراحة التقيد التام
                    باللتزمات التي قررها القانون المذكور على كل من المؤجر والمستأجر.
                </h4>



            </div>

            <div class="break-after"></div>

            <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 24px;border-radius: 10px;">

                <div
                    style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: space-between; border-radius: 5px;">
                    <h2 class="bold m-0"> Contract of Conditions </h2>
                    <h2 class="bold m-0"> شروط العقد العامة </h2>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class=" Conditions"><span class="bold">(1) </span>The Tenant hereby admits to have inspected the
                        leased
                        property and has accepted in its present condition. </p>
                    <p class=" Conditions"><span class="bold">(1) </span> بموجب هذا العقد يقر الطرف الثاني بانة قد قام
                        بمعاينة العقار المؤجر
                        وانه قد قبله
                        بحالته الراهنة . </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class=" Conditions"><span class="bold">(2) </span> The Tenant shall not modify or demolish any
                        part of the
                        leased property or sublease the same without the prior written
                        consent of The Landlord and shall not, on the Expiry of the
                        Contract or the termination thereof, remove a construction
                        made expect with prior written consent of the Landlord. </p>
                    <p class=" Conditions"><span class="bold">(2) </span> ل يجوز للمستأجر إدخال أي تعديلت أو هدم أي جزء
                        من العقار المؤجر أو
                        التنازل من
                        ايجاره ، دون حصوله على موافقة مسبقة و خطية من المؤجر و يتعهد المستأجر بانه لن
                        يقوم عند انقضاء مدة هذا العقد او انهائه بازالة اية مباني تم انشاؤها في العقار المؤجر ال
                        بعد الحصول على موافقه خطية مسبقة من المؤجر. </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class=" Conditions"><span class="bold">(3) </span> The Tenant hereby undertakes to pay the cost
                        of his
                        consumption of electricity, water, telephone, fax, telex, Bills,
                        etc. </p>
                    <p class=" Conditions"><span class="bold">(3) </span> يتعهد المستأجر بتسديد جميع رسوم و تكاليف
                        استهلكه من الكهرباء و الماء و
                        استعمال
                        الهاتف / الفاكس / التلكس .. و غيره. </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class=" Conditions"><span class="bold">(4) </span> In case any issue is not expressly provided
                        for in the
                        special conditions hereof, or in the provision of the Leasing
                        Law, the same shall be Resolved under the general provisions
                        of the U.A.E. Code of Civil Transactions. </p>
                    <p class=" Conditions"><span class="bold">(4) </span>في حالة نشوء أي مسألة لم يتم النص عليها صراحة
                        ضمن الشروط الخاصة في هذا
                        العقد أو ضمن احكام قانون اليجارات فتطبق بشأنها احكام النصوص العامة في قانون
                        المعاملت المدينة الساري المفعول في الدولة. </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class=" Conditions"><span class="bold">(5) </span> The lessor and the lessee is committed to the
                        laws and
                        regulations issued thereon hind buildings to fall and places
                        permitted housing demolition workers.
                    </p>
                    <p class=" Conditions"><span class="bold">(5) </span> يلتزم المؤجر و المستأجر بالقوانين والنظمة
                        الصادر بشأنها هدم المباني
                        اليلة للسقوط
                        و الماكن المسموح بها سكن عمال. </p>
                </div>

                <div style="padding:8px 16px;   display: flex; justify-content: space-between;">
                    <p class=" Conditions"><span class="bold">(6) </span> Any notice to renew the contract or not
                        wanting to renew or
                        request to increase the allowance or decreased must be three
                        months from the date of the end of the existing lease contract
                        before and only take it if it was not. </p>
                    <p class=" Conditions"><span class="bold">(6) </span>أي إخطار بتجديد العقد أو عدم الرغبة في تجديده
                        أو طلب زيادة البدل أو
                        انقاصه لبد و
                        أن يتم قبل ثلثة أشهر من تاريخ انتهاء عقد اليجار القائم وال اعتبر كأن لم يكن . </p>
                </div>



            </div>
            

            <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 24px;border-radius: 10px;">

                <div
                    style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: space-between; border-radius: 5px;">
                    <h2 class="bold m-0"></h2>
                    <h2 class="bold m-0">شروط العقد الخاصه</h2>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label"> </p>
                    <p class="bold label">1-${pmcontract.condition1 || ''} </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label"> </p>
                    <p class="bold label">2-${pmcontract.condition2 || ''} </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label"> </p>
                    <p class="bold label">3-${pmcontract.condition3 || ''} </p>
                </div>
                <div
                    style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                    <p class="bold label"> </p>
                    <p class="bold label">4-${pmcontract.condition4 || ''} </p>
                </div>

                <div style="padding:8px 16px;   display: flex; justify-content: space-between;">
                    <p class="bold label"> </p>
                    <p class="bold label">5-${pmcontract.condition5 || ''} </p>
                </div>



            </div>

            <div class="break-after"></div>

            <div
                style="padding: 16px; background-color: #e9e9e9;  display: flex; justify-content: center; border-radius: 5px;">
                <h2 class="bold m-0" style="text-align: center !important;">بيان الدفعات </h2>
            </div>

            <table class="table-border" style="margin-top:8px; margin-bottom: 24px;">
                <tr>
                    <td class="bold label black">التوقيع بالستلم</td>
                    <td class="bold label black">التاريخ</td>
                    <td class="bold label black">رقم اليصال</td>
                    <td class="bold label black">نقدا / شيك</td>
                    <td class="bold label black">الرقم</td>
                </tr>
                <tr>
                   ${paymentRows}
                </tr>
               
            </table>

            <div style="display: flex; justify-content: space-between;margin-bottom: 50px;">

                <div style="width: 45%;">
                    <h3 style="text-align: center; margin-bottom: 16px;">Signature of second party</h3>
                    <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 16px;border-radius: 10px;  height: 200px;"> </div>
                    <div style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                        <p class="bold label">Date </p>
                        <p class="bold label">التاريخ </p>
                    </div>

                </div>

                <div style="width: 45%;">
                    <h3 style="text-align: center; margin-bottom: 16px;">Signature of First party</h3>
                    <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 16px;border-radius: 10px;  height: 200px;"> </div>
                    <div style="padding:8px 16px; border-bottom: 1px solid #cacaca;  display: flex; justify-content: space-between;">
                        <p class="bold label">Date </p>
                        <p class="bold label">التاريخ </p>
                    </div>

                </div>

            </div>

             <div style="margin-bottom: 24px;">
                    <h3 style="text-align: center; margin-bottom: 16px;">Signature of First party</h3>
                    <div style="border: 1px solid #afafaf; padding: 8px ; margin-bottom: 16px;border-radius: 10px;  height: 350px; justify-items: end;"> 
                        <div style="padding:0 16px 32px 16px; border-bottom: 1px solid #cacaca;  display: flex;width: 200px;">
                            <h5 class="bold label" style="width: 100%;"><span>Approval Date</span> / <span>تاريخ التوثيق</span></h5>
                        </div>
                    </div>
                   
                    

                </div>
                
                <div style="padding-bottom: 24px;">
                   <h2 class="bold" style="text-align: end; ">
                ملاحظات
                    </h2>
                    <h4 style="text-align: end; font-weight: 500;">
                        بموجب هذا العقد يوافق المؤجر على تأجير العقار الموصوف أعله
                        وللمدة المحددة أعله للمستأجر وذلك حسب الشروط التالية:
                
                    </h4>
                    <h4 style="margin-bottom: 24px; font-weight: 500;">The Landlord hereby agrees to rent property described
                        herein above for the prescribed period to the Tenant in
                
                    </h4>
                
                
                
                
                </div>






        </div>
    </section>


</body>

</html>
`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}




}



