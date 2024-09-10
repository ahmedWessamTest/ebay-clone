import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { userAlreadyLoggedGuard } from './core/guards/user-already-logged.guard';
import { userLoggedGuard } from './core/guards/user-logged.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, canActivate: [userAlreadyLoggedGuard], children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('../app/components/login/login.component').then((c) => c.LoginComponent) },
      { path: 'register', loadComponent: () => import('../app/components/register/register.component').then((c) => c.RegisterComponent) },
      { path: 'forgot', loadComponent: () => import('../app/components/register/register.component').then((c) => c.RegisterComponent) }
    ]
  },
  {
    path: '', component: BlankLayoutComponent, canActivate: [userLoggedGuard], children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component:HomeComponent },
      { path: 'cart', loadComponent: () => import('../app/components/cart/cart.component').then((c) => c.CartComponent) },
      { path: 'categories/:id', loadComponent: () => import('../app/components/categories/categories.component').then((c) => c.CategoriesComponent) },
      { path: 'subCat/:catId/:subCatId', loadComponent: () => import('../app/components/sub-category-view/sub-category-view.component').then((c) => c.SubCategoryViewComponent) },
      { path: 'brands', loadComponent: () => import('../app/components/brands/brands.component').then((c) => c.BrandsComponent) },
      { path: 'products', loadComponent: () => import('../app/components/products/products.component').then((c) => c.ProductsComponent) },
      { path: 'brandProducts/:id', loadComponent: () => import('../app/components/brand-view/brand-view.component').then((c) => c.BrandViewComponent) },
      { path: 'details/:id', loadComponent: () => import('../app/components/product-details/product-details.component').then((c) => c.ProductDetailsComponent), runGuardsAndResolvers: 'paramsChange' },
      { path: 'checkout/:id', loadComponent: () => import('../app/components/checkout/checkout.component').then((c) => c.CheckoutComponent) },
      { path: 'allorders', loadComponent: () => import('../app/components/allorders/allorders.component').then((c) => c.AllordersComponent) },
    ]

  },
  { path: '**', loadComponent: () => import('../app/components/not-found/not-found.component').then((c) => c.NotFoundComponent) }
];
