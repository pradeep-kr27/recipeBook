import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropDown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isDropdownOpen = false;

    @HostListener('document:click',['$event']) toggleDropdownOpen(event: Event){
        this.isDropdownOpen=this.elementRef.nativeElement.contains(event.target) ? !this.isDropdownOpen: false;
    }

    constructor(private elementRef: ElementRef){}
}