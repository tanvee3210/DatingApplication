import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgotpagePage } from './forgotpage.page';

describe('ForgotpagePage', () => {
  let component: ForgotpagePage;
  let fixture: ComponentFixture<ForgotpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
