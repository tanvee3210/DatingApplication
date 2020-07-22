import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerficationpagePage } from './verficationpage.page';

describe('VerficationpagePage', () => {
  let component: VerficationpagePage;
  let fixture: ComponentFixture<VerficationpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerficationpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerficationpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
