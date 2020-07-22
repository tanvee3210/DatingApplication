import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationpagePage } from './locationpage.page';

describe('LocationpagePage', () => {
  let component: LocationpagePage;
  let fixture: ComponentFixture<LocationpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
