// This file is used to save and persist the token in the Swagger Authorize window
window.onload = function () {
  const ui = SwaggerUIBundle({
    url: '/docs-json',
    dom_id: '#swagger-ui',
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'StandaloneLayout',
    responseInterceptor: function (response) {
      if (
        response.url &&
        response.url.endsWith('auth/sign-in') &&
        response.status === 200
      ) {
        const body = JSON.parse(response.data);
        const token = body.access_token;
        if (token) {
          localStorage.setItem('access_token', token);
          ui.preauthorizeApiKey('access_token', token);
          alert('✅ Token saved and persisted in Swagger Authorize.');
        }
      }
      return response;
    },
  });

  setTimeout(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      ui.preauthorizeApiKey('access_token', savedToken);
      console.log('✅ Token loaded from localStorage and applied.');
    }
  }, 1000);
  
  window.ui = ui;
};
