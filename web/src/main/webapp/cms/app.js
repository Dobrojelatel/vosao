// file app.js
/*
 Vosao CMS. Simple CMS for Google App Engine.
 
 Copyright (C) 2009-2011 Vosao development team.

 This library is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with this library; if not, write to the Free Software
 Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

 email: vosao.dev@gmail.com
*/

define(['view/LoginView', 'view/PagesView', 'view/IndexView',
        'view/StructuresView', 'view/StructureView', 'view/StructureTemplateView',
        'view/TemplatesView', 'view/TemplateView',
        'view/page/PageView', 'view/ProfileView', 'view/plugins/PluginsView',
        'view/plugins/ConfigView', 'view/plugins/FormsView', 'view/plugins/FormView',
        'view/plugins/SeoUrlsView',
        
        'text!template/topbar.html', 'text!template/locale.html'], 
function(LoginView, PagesView, IndexView, 
		StructuresView, StructureView, StructureTemplateView,
		TemplatesView, TemplateView,
		PageView, ProfileView, 
		PluginsView, PluginsConfigView, PluginsFormsView, PluginsFormView,
		SeoUrlsView,
		topbarTmpl, localeTmpl){
	
	console.log("app.js");

	return Backbone.Router.extend({

		initialize:function() {
			this.bind("login", this.login, this);
			this.currentView = this.loginView.render();
			$('#loading').html(messages('loading'));
			$('.splash').hide();
			$('#topbar, #wrapper').fadeIn();
		},

		// Views
		
		currentView: null,
		indexView: new IndexView(),
		loginView: new LoginView(),
		pagesView: new PagesView(),
		structuresView: new StructuresView(),
		structureView: new StructureView(),
		structureTemplateView: new StructureTemplateView(),
		templatesView: new TemplatesView(),
		templateView: new TemplateView(),
		pageView: new PageView(),
		profileView: new ProfileView(),
		pluginsView: new PluginsView(),
		pluginsConfigView: new PluginsConfigView(),
		pluginsFormsView: new PluginsFormsView(),
		pluginsFormView: new PluginsFormView(),
		pluginsSeoUrlsView: new SeoUrlsView(),

		routes: {
			'index': 			'index',
			'pages': 			'pages',
			
			'page/content/:id': 'editContent',
			'page/:id': 		'editPage',

			'structures':		'structures',
			'structure':		'addStructure',
			'structure/:id':	'editStructure',

			'addStructureTemplate/:id'	: 'addStructureTemplate',
			'structureTemplate/:id' 	: 'structureTemplate',

			'profile':			'profile',
			'logout':			'logout',
			
			'plugins':			'plugins',
			'plugins/config':	'pluginsConfig',
			'plugins/forms':	'pluginsForms',
			'plugins/form':		'pluginsFormNew',
			'plugins/form/:id':	'pluginsFormEdit',
			'plugins/seo-urls':	'pluginsSeoUrls',
			
			'templates':		'templates',
			'template':			'createTemplate',
			'template/:id':		'editTemplate'
			
		},
		
		// Routes handlers
		
		show: function(view) {
			if (this.currentView) {
				this.currentView.remove();
				this.currentView = null;
			}
			this.currentView = view;
			$('#content').hide();
			view.render();
			$('#content').fadeIn();
		},
		
		pages: function() {
			this.show(this.pagesView);
		},
		
		index: function() {
			this.show(this.indexView);
		},

		structures: function() {
			this.show(this.structuresView);
		},
		
		addStructure: function() {
			this.structureView.setId('');
			this.show(this.structureView);
		},
		
		editStructure: function(id) {
			this.structureView.setId(id);
			this.show(this.structureView);
		},
		
		addStructureTemplate: function(id) {
			this.structureTemplateView.create(id);
			this.show(this.structureTemplateView);
		},
		
		structureTemplate: function(id) {
			this.structureTemplateView.edit(id);
			this.show(this.structureTemplateView);
		},
		
		templates: function() {
			this.show(this.templatesView);
		},
		
		createTemplate: function() {
			this.templateView.create();
			this.show(this.templateView);
		},
		
		editTemplate: function(id) {
			this.templateView.edit(id);
			this.show(this.templateView);
		},

		editContent: function(id) {
			this.pageView.editContent(id);
			this.show(this.pageView);
		},
		
		editPage: function(id) {
			this.pageView.editPage(id);
			this.show(this.pageView);
		},
		
		profile: function(id) {
			this.show(this.profileView);
		},

		plugins: function() {
			this.show(this.pluginsView);
		},
		
		pluginsConfig: function() {
			this.show(this.pluginsConfigView);
		},

		pluginsForms: function() {
			this.show(this.pluginsFormsView);
		},

		pluginsFormNew: function() {
			this.pluginsFormView.setId('');
			this.show(this.pluginsFormView);
		},
		
		pluginsFormEdit: function(id) {
			this.pluginsFormView.setId(id);
			this.show(this.pluginsFormView);
		},

		pluginsSeoUrls: function() {
			this.show(this.pluginsSeoUrlsView);
		},
		
		logout: function() {
	        Vosao.jsonrpc.loginFrontService.logout(function (r, e) {
	            if (Vosao.serviceFailed(e)) return;
	            if (r.result == 'success') {
	                location.href = '/';
	            }
	            else {
	                Vosao.showServiceMessages(r);
	            }
	        });
		},
		
		// Event handlers
		
		login: function() {
			Vosao.jsonrpcInitialized = false;
			Vosao.createJSONRpc();
		    Vosao.initJSONRpcSystem(Vosao.initBackServices);
			Vosao.initJSONRpc(function() {
				Vosao.jsonrpc.userService.getLoggedIn(function(user) {
					Vosao.app.user = user;

					var localeHtml = _.template(localeTmpl, {messages:messages});
					$('#topbar').html(_.template(topbarTmpl, 
						{locale: localeHtml, "Vosao": Vosao, "messages": messages}
					));
					$('#languageSelect').click(function() {
						$('#languageDiv').show();
						setTimeout(function() {
					        $('#languageDiv').hide();
						}, 5000);
					});

					if (!Backbone.history.start()) {
						Vosao.app.navigate('index', true);
					}
				});
			});
		}
	});

});