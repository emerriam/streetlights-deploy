class LightsController < ApplicationController
  before_action :set_light, only: [:show, :edit, :update, :destroy]
  helper_method :sort_column, :sort_direction

  # GET /lights
  # GET /lights.json
  def index
    if light_params[:dir] && light_params[:field]
      query =  light_params[:field].to_s + 
        ' ' + light_params[:dir].to_s

      @lights = Light.order(query)
    else
      @lights = Light.all
    end
  end

  # GET /lights/1
  # GET /lights/1.json
  def show
    @light = Light.find(params[:id])
  end

  # GET /lights/new
  def new
    @light = Light.new
  end

  # GET /lights/1/edit
  def edit
    @light = Light.find(params[:id])
  end

  # POST /lights
  # POST /lights.json
  def create
    @light = Light.new(light_params)
    respond_to do |format|
      if @light.save
        format.json { render :show }
        format.js {render :show}
      else
        format.json { render json: @light.errors, status: :unprocessable_entity }
        format.js {}
      end
    end
  end

  # PATCH/PUT /lights/1
  # PATCH/PUT /lights/1.json
  def update
    respond_to do |format|
      if @light.update(light_params)
        format.json { render :show, status: :ok, location: @light }
      else
        format.json { render json: @light.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lights/1
  # DELETE /lights/1.json
  def destroy
    @light.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_light
      @light = Light.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def light_params
      # Sloppy param filtering need to implement strang paramaters here.
      if params[:sorters]
        params[:dir] = params[:sorters]["0"][:dir]
        params[:field] = params[:sorters]["0"][:field]
      end

      if params[:filters]
        params[:type] = params[:filters]["0"][:type]
        params[:field] = params[:filters]["0"][:field]
        params[:value] = params[:filters]["0"][:value]
      end

      params.permit(:id, :alias, :status, :color, :created_at, :longitude, :latitude, :dir, :field, :value, :type)


    end

    def sort_column
      Light.column_names.include?(light_params[:field]) ? light_params[:field] : "alias"
    end
    
    def sort_direction
      %w[asc desc].include?(light_params[:dir]) ?  light_params[:dir] : "asc"
    end

end
