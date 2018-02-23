Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # resources :lights, only: [:create, :new, :show, :edit, :update, :destroy]
	resources :lights
	root to: 'lights#index'
end
