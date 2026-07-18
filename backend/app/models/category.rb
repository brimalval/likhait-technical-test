class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy

  before_validation :normalize_name

  validates :name, presence: true, uniqueness: true

  private

  def normalize_name
    self.name = name.strip if name.respond_to?(:strip)
  end
end
