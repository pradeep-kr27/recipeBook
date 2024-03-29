import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
    declarations: [
        DropdownDirective,
        LoadingSpinnerComponent,
    ],
    imports: [CommonModule],
    exports: [
        DropdownDirective,
        LoadingSpinnerComponent,
        CommonModule
    ]
})
export class SharedModule {}