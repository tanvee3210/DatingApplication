import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrefergenderPage } from './prefergender.page';

describe('PrefergenderPage', () => {
  let component: PrefergenderPage;
  let fixture: ComponentFixture<PrefergenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefergenderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrefergenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
