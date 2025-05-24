import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../servicesApi/landing.service';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss'
})
export class ContractComponent implements OnInit {
  currentItemCollabsed: any;
  currentLang: string = 'en'; // or 'ar', based on your logic
  contractsList: any[] = [];
  userId: any;
  printPmContractDataList: any = [];

  constructor(
    private _SpinnerService: SpinnerService,
    private router: Router,
    private translate: TranslateService,
    private landingService: LandingService,
    private route: ActivatedRoute

  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }
  ngOnInit(): void {
    this.getContracts();
    // Capture the query parameters from the URL

  }


  getContracts() {
    let userId = null; // تعيين قيمة افتراضية

    const userData = localStorage.getItem('userData');

    if (userData) {
      try {
        userId = JSON.parse(userData)?.userId;
        this.userId = userId;
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

        this.route.queryParams.subscribe(params => {
          // Corrected the typo here from 'currentItemCollabsed' to 'currentItemCollapsed'
          this.currentItemCollabsed = params['currentItemCollapsed'];
          if (this.currentItemCollabsed) {
            console.log("details");
          } else {
            this.currentItemCollabsed = this.contractsList[0]?.id;
          }
          console.log("this.currentItemCollabsed", this.currentItemCollabsed);
        });


      },
      error: (error) => {
        this._SpinnerService.hideSpinner();

      },
      complete: () => {
        this._SpinnerService.hideSpinner();
      }
    })
  };
  getStatusClass(status: string): string {
    switch (status) {
      case 'Renew':
        return 'status-renew';
      case 'Expired':
        return 'status-expired';
      case 'Canceled':
        return 'status-canceled';
      case 'Cleared':
        return 'status-cleared';
      case 'New':
        return 'status-new';
      case 'received':
        return 'status-received';
      default:
        return ''; // Default case, no class applied
    }
  }


  printPmContractData(id: any) {
    // debugger;
    this._SpinnerService.showSpinner();

    const lang = localStorage.getItem('lang') || 'en';
    this.landingService.printPmContract(id, lang).subscribe(
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


}
