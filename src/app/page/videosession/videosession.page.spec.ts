import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideosessionPage } from './videosession.page';

describe('VideosessionPage', () => {
  let component: VideosessionPage;
  let fixture: ComponentFixture<VideosessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosessionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideosessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
