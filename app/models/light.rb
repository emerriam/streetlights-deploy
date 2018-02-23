class Light < ApplicationRecord
	validates :longitude, presence: true , numericality: { allow_blank: false }
	validates :latitude, presence: true , numericality: { allow_blank: false }
	validates :status, presence: true
	validates :color, presence: true
	validates :latitude, presence: true
	# Validate name is unique unless it's "none"

	def alias
		return self.id
	end

	def self.search(search)
    if search
      where('name LIKE ?', "%#{search}%")
    else
      scoped
    end
  end
  
end
