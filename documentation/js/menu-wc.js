'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-starter documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-44afeb521d61f46f60c0d47a194e674aae4068dc64f9700cc29e20dea8cac8f22ba8c4b6e2748c2eec2f4376eef3ef60d7bc2640d079214838ee101807b669dd"' : 'data-bs-target="#xs-controllers-links-module-AppModule-44afeb521d61f46f60c0d47a194e674aae4068dc64f9700cc29e20dea8cac8f22ba8c4b6e2748c2eec2f4376eef3ef60d7bc2640d079214838ee101807b669dd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-44afeb521d61f46f60c0d47a194e674aae4068dc64f9700cc29e20dea8cac8f22ba8c4b6e2748c2eec2f4376eef3ef60d7bc2640d079214838ee101807b669dd"' :
                                            'id="xs-controllers-links-module-AppModule-44afeb521d61f46f60c0d47a194e674aae4068dc64f9700cc29e20dea8cac8f22ba8c4b6e2748c2eec2f4376eef3ef60d7bc2640d079214838ee101807b669dd"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' :
                                            'id="xs-controllers-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' }>
                                            <li class="link">
                                                <a href="controllers/AuthAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' :
                                        'id="xs-injectables-links-module-AuthModule-4c5a72f870580c7b98f4e3dab7893498c5796045edb98fa63f44b422986513e6a96945b8cf6bdf3058684354280d3baf1cc0ae863aeb4d429b906e0572adda38"' }>
                                        <li class="link">
                                            <a href="injectables/AdminLocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminLocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthAdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthAdminService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthCommonService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthCommonService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAdminRefreshStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAdminRefreshStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAdminStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAdminStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtRefreshStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonModule.html" data-type="entity-link" >CommonModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link" >HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HealthModule-c62dd427256bdf624556c6bb9a01b24664a73dad0767bb71722e98d1242c9ba5045206b9c008bd48cfdd7d048d5d7913d7843290eed03d73bbdb80ef2fc3e739"' : 'data-bs-target="#xs-controllers-links-module-HealthModule-c62dd427256bdf624556c6bb9a01b24664a73dad0767bb71722e98d1242c9ba5045206b9c008bd48cfdd7d048d5d7913d7843290eed03d73bbdb80ef2fc3e739"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-c62dd427256bdf624556c6bb9a01b24664a73dad0767bb71722e98d1242c9ba5045206b9c008bd48cfdd7d048d5d7913d7843290eed03d73bbdb80ef2fc3e739"' :
                                            'id="xs-controllers-links-module-HealthModule-c62dd427256bdf624556c6bb9a01b24664a73dad0767bb71722e98d1242c9ba5045206b9c008bd48cfdd7d048d5d7913d7843290eed03d73bbdb80ef2fc3e739"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' : 'data-bs-target="#xs-controllers-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' :
                                            'id="xs-controllers-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' : 'data-bs-target="#xs-injectables-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' :
                                        'id="xs-injectables-links-module-UserModule-859e46062a6bb5739abeaa4009d2be1aa065e4cd573ad1b673a6eaa7528d668c9f03e70666681b2637785cdb7dc643e378b69b2f3f96d42f22b8e3bc8f9486c9"' }>
                                        <li class="link">
                                            <a href="injectables/UserAdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserAdminService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UtilsModule.html" data-type="entity-link" >UtilsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UtilsModule-db94e6bb3fa7777b9a5e97a9e0059238faa01310be0eaa4dbc45630472ab531add93a6d8a310378a336165ca96b3b1d262dd8c17383a5aeebc0f0a8332e10859"' : 'data-bs-target="#xs-injectables-links-module-UtilsModule-db94e6bb3fa7777b9a5e97a9e0059238faa01310be0eaa4dbc45630472ab531add93a6d8a310378a336165ca96b3b1d262dd8c17383a5aeebc0f0a8332e10859"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UtilsModule-db94e6bb3fa7777b9a5e97a9e0059238faa01310be0eaa4dbc45630472ab531add93a6d8a310378a336165ca96b3b1d262dd8c17383a5aeebc0f0a8332e10859"' :
                                        'id="xs-injectables-links-module-UtilsModule-db94e6bb3fa7777b9a5e97a9e0059238faa01310be0eaa4dbc45630472ab531add93a6d8a310378a336165ca96b3b1d262dd8c17383a5aeebc0f0a8332e10859"' }>
                                        <li class="link">
                                            <a href="injectables/UtilsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UtilsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AfterAdminSignInEvent.html" data-type="entity-link" >AfterAdminSignInEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AfterAdminSignInEventHandler.html" data-type="entity-link" >AfterAdminSignInEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AfterResetPasswordEvent.html" data-type="entity-link" >AfterResetPasswordEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AfterResetPasswordHandler.html" data-type="entity-link" >AfterResetPasswordHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AfterSignInEvent.html" data-type="entity-link" >AfterSignInEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AfterSignInEventHandler.html" data-type="entity-link" >AfterSignInEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmResetPasswordDto.html" data-type="entity-link" >ConfirmResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeneralResponse.html" data-type="entity-link" >GeneralResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserHandler.html" data-type="entity-link" >GetUserHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserQuery.html" data-type="entity-link" >GetUserQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordEntity.html" data-type="entity-link" >ResetPasswordEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpUserCommand.html" data-type="entity-link" >SignUpUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpUserHandler.html" data-type="entity-link" >SignUpUserHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCommand.html" data-type="entity-link" >UpdateUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserHandler.html" data-type="entity-link" >UpdateUserHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link" >UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResetPassword.html" data-type="entity-link" >UserResetPassword</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/IpMiddleware.html" data-type="entity-link" >IpMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAdminAuthenticationGuard.html" data-type="entity-link" >JwtAdminAuthenticationGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAdminRefreshTokenGuard.html" data-type="entity-link" >JwtAdminRefreshTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthenticationGuard.html" data-type="entity-link" >JwtAuthenticationGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshTokenGuard.html" data-type="entity-link" >JwtRefreshTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LanguageMiddleware.html" data-type="entity-link" >LanguageMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link" >LoggingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ObjectIDPipe.html" data-type="entity-link" >ObjectIDPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AdminSignInPayloadInterface.html" data-type="entity-link" >AdminSignInPayloadInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetTimeParams.html" data-type="entity-link" >GetTimeParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayloadInterface.html" data-type="entity-link" >JwtPayloadInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtTokensInterface.html" data-type="entity-link" >JwtTokensInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestInterface.html" data-type="entity-link" >RequestInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResetPasswordData.html" data-type="entity-link" >ResetPasswordData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignInPayloadInterface.html" data-type="entity-link" >SignInPayloadInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});