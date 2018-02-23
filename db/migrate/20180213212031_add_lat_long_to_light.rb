class AddLatLongToLight < ActiveRecord::Migration[5.1]
  def change
  	add_column :lights, :latitude, :float
  	add_column :lights, :longitude, :float
  	add_column :lights, :status, :string, default: "None"
  	add_column :lights, :alias, :string, default: "None"
  	add_column :lights, :color, :string, default: "None"

  	add_index :lights, [:latitude, :longitude], name: "light_lat_long_index", unique: true, using: :btree
  	add_index :lights, :alias, name: "light_name_index", using: :btree
  	add_index :lights, :color, name: "light_color_index", using: :btree
  	add_index :lights, :status, name: "light_status_index", using: :btree

  end
end
