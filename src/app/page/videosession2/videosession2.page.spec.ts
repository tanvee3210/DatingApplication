import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Videosession2Page } from './videosession2.page';

describe('Videosession2Page', () => {
  let component: Videosession2Page;
  let fixture: ComponentFixture<Videosession2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Videosession2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Videosession2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
