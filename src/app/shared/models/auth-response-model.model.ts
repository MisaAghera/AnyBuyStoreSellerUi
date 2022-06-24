export class AuthResponseModel {
    token: string='';
    userId : number = 0;
    userName : string = '';
    isAuthSuccessful: boolean  = true;
    errorMessage: string= '';
}
