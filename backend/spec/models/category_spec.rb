require 'rails_helper'

RSpec.describe Category, type: :model do
  describe 'validations' do
    it 'requires a name' do
      category = Category.new(name: '')

      expect(category).not_to be_valid
      expect(category.errors[:name]).to include("can't be blank")
    end

    it 'requires a unique name' do
      Category.create!(name: 'Food')
      duplicate = Category.new(name: 'Food')

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:name]).to include('has already been taken')
    end
  end
end
