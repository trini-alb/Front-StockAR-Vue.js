<template>
    <header class="u-black u-clearfix u-header u-header" id="header">
        <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
            <div class="custom-expanded u-clearfix u-custom-html u-custom-html-1">
                <div class="menu-usuario">
                    <input type="checkbox" id="toggle-menu" class="toggle-menu" />
                    <label for="toggle-menu" class="icono-usuario">
                        <img src="/images/usuario.png" alt="Icono de usuario" />
                    </label>
                    <div class="menu-desplegable">
                        <a href="Login.html">Cerrar sesión</a> &nbsp;&nbsp;
                    </div>
                </div>
            </div>
            <p class="u-text u-text-default u-text-1">
                <span style="font-size: 1.875rem;">Agregar Repuesto</span>
            </p>
        </div> 

        <nav class="u-align-left u-font-size-14 u-menu u-menu-hamburger u-nav-spacing-25 u-offcanvas u-menu-1" data-responsive-from="XL" role="navigation">
            <div class="menu-collapse">
                <a id="drawerToggle" class="u-button-style u-hamburger-link u-nav-link u-hamburger-link-1" href="#" tabindex="-1" aria-label="Open menu" aria-controls="f3cb">
                    <svg class="u-svg-link" preserveAspectRatio="xMidYMin slice" viewBox="0 0 302 302" style=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-e5e3" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="svg-e5e3" x="0px" y="0px" viewBox="0 0 302 302" style="enable-background:new 0 0 302 302;" xml:space="preserve" class="u-svg-content"><g><rect y="36" width="302" height="30"></rect><rect y="236" width="302" height="30"></rect><rect y="136" width="302" height="30"></rect>
                    </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                </a>
            </div>
            <div class="u-custom-menu u-nav-container">
                <ul role="menubar" class="u-nav u-unstyled u-nav-1">
                    <li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#" aria-current="page" aria-haspopup="true" style="padding: 10px 114px;" aria-expanded="false">Login</a></li>
                    <li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="#" style="padding: 10px 114px;">Contacto</a></li>
                    <li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" style="padding: 10px 113px 10px 114px;">Productos</a></li>
                </ul>
            </div>
            <div class="u-custom-menu u-nav-container-collapse" id="f3cb" role="region" aria-label="Menu panel">
                <div class="u-align-center u-black u-container-align-center u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
                    <div class="u-inner-container-layout u-sidenav-overflow">
                        <div class="u-menu-close" tabindex="-1" aria-label="Close menu"></div>
                        <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-2">
                            <li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link" href="#" aria-current="page" aria-haspopup="true">Login</a></li>
                            <li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link" href="#">Contacto</a></li>
                            <li role="none" class="u-nav-item"><a tabindex="-1" role="menuitem" class="u-button-style u-nav-link">Productos</a></li>
                        </ul>
                    </div>
                </div>
                <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
            </div>
            </nav>
    </header>
</template>

<script setup>

</script>

<style scoped>
/* Pega aquí el CSS que estaba dentro del bloque <style class="menu-style"> de Nicepage */
@media (max-width: 939px) {
    [data-responsive-from="MD"] .u-nav-container {
        display: none;
    }
    [data-responsive-from="MD"] .menu-collapse {
        display: block;
    }
}
</style>