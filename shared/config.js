Accounts.config({
  forbidClientAccountCreation : true
});

Blog.config({  
  adminBasePath: '/admin/:id/publicaciones/blogAdmin',
  adminRole: 'blogAdmin'
});
