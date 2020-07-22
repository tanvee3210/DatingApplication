import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UniversitynamePage } from './universityname.page';

describe('UniversitynamePage', () => {
  let component: UniversitynamePage;
  let fixture: ComponentFixture<UniversitynamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversitynamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UniversitynamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
