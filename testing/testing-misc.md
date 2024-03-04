
## Access template reference variable

references	

Dictionary of objects associated with template local variables (e.g. #foo), keyed by the local variable name.

```typescript
// Filter for DebugElements with a #content reference
const contentRefs = el.queryAll( de => de.references['content']);
```

## Access directive instance

```typescript
@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

//=======================
  beforeEach(() => {
    fixture.detectChanges(); // trigger initial data binding

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  });
```

## Access component instance

```typescript
@Component({
  template: `<p-confirmDialog></p-confirmDialog>

  <button type="button" (click)="confirm1()" pButton icon="pi pi-check" label="Confirm"></button>`
})
class TestConfirmDialogComponent {

  constructor(private confirmationService: ConfirmationService) {}

  header:string;

  confirm1() {
	this.confirmationService.confirm({
	message: 'Are you sure that you want to proceed?',
	header: 'Confirmation',
	icon: 'pi pi-exclamation-triangle',
	accept: () => {
		this.header = "accept";
		},
		reject: () => {
		this.header = "reject";
		}
	});
  }

}

//================

describe('ConfirmDialog', () => {
  
  let confirmDialog: ConfirmDialog;
  let fixture: ComponentFixture<TestConfirmDialogComponent>;
  
  beforeEach(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NoopAnimationsModule
      ],
      declarations: [
        ConfirmDialog,
        TestConfirmDialogComponent,
      ],
      providers:[
        ConfirmationService
      ]
      });
      
      fixture = TestBed.createComponent(TestConfirmDialogComponent);
      confirmDialog = fixture.debugElement.query(By.css('p-confirmDialog')).componentInstance;
    });
  });
}
```