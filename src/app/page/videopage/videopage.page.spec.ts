import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideopagePage } from './videopage.page';

describe('VideopagePage', () => {
  let component: VideopagePage;
  let fixture: ComponentFixture<VideopagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideopagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideopagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
