import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NewComponent } from '../../g-admin/livesteam/new/new.component';
import { FacebookLoginProvider } from '@abacritt/angularx-social-login';

@Component({
    selector       : 'chat',
    templateUrl    : './chat.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent
{
    [x: string]: any;
    signInWithFB(): void {
        

        const fbLoginOptions = {
            scope: 'publish_video,pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,pages_manage_posts,public_profile'
          }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
          
          this.authService.signIn(FacebookLoginProvider.PROVIDER_ID, fbLoginOptions);

      }
    
      signOut(): void {
        this.authService.signOut();
      }

      openPage() {
        // console.log(this.socialUser.authToken)
        // this._Service.getToken(this.socialUser.authToken).subscribe((resp: any) => {
        //     this.tokenData = resp.data
        //     console.log(this.tokenData)
        // })
        const dialogRef = this._matDialog.open(NewComponent, {
            width: '50%',
            height: '50',
        });
        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }

}
