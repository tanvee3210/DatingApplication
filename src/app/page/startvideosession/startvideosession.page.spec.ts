import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartvideosessionPage } from './startvideosession.page';

describe('StartvideosessionPage', () => {
  let component: StartvideosessionPage;
  let fixture: ComponentFixture<StartvideosessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartvideosessionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartvideosessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
