import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtpverficationPage } from './otpverfication.page';

describe('OtpverficationPage', () => {
  let component: OtpverficationPage;
  let fixture: ComponentFixture<OtpverficationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpverficationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpverficationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
