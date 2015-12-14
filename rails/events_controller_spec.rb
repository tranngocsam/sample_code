require 'rails_helper'

describe Api::V1::Admin::EventsController do
  let!(:event) { FactoryGirl.create(:event) }
  let(:valid_attributes) { FactoryGirl.attributes_for(:event) }

  before(:each) do
    login_admin
  end
  
  describe "GET index" do
    it "should list events" do
      number = rand(10)
      number = 1 if number == 0
      FactoryGirl.create_list(:event, number)

      get :index
      expect(response).to be_success

      expect(json["results"]).to be_present
      expect(json["results"].length).to eql(number + 1)
    end

    it "should return events with invites_total and used_invites_total" do
      get :index
      expect(response).to be_success

      expect(json["results"][0]["invites_total"]).to eql(0)
      expect(json["results"][0]["used_invites_total"]).to eql(0)
    end

    it "should allow to select fields" do
      get :index, :select => "id, name"
      expect(response).to be_success

      expect(json["results"][0]["created_at"]).to be_blank
      expect(json["results"][0]["updated_at"]).to be_blank
    end
  end

  describe "POST create" do
    it "should create event with valid params" do
      post :create, :event => valid_attributes
      expect(json["results"]["name"]).to eql(valid_attributes[:name])
    end

    it "should not create event without name" do
      post :create, :event => {:description => Faker::Lorem.sentence}
      expect(response).not_to be_success

      expect(json["errors"]).to be_present
      expect(json["errors"]["name"]).to be_present
    end
  end

  describe "PUT update" do
    it "should update event with valid params" do
      put :create, :id => event.id, :event => valid_attributes
      expect(json["results"]["name"]).to eql(valid_attributes[:name])
    end

    it "should not update event with blank name" do
      put :create, :id => event.id, :event => {:name => ""}
      expect(response).not_to be_success
      expect(json["errors"]).to be_present
      expect(json["errors"]["name"]).to be_present
    end
  end

  describe "GET show" do
    it "should get event" do
      get :show, :id => event.id
      expect(response).to be_success
      expect(json["results"]["id"]).to eql(event.id)
    end

    it "should not get not existence event" do
      expect{get :show, :id => 1000}.to raise_error
    end
  end

  describe "DELETE destroy" do
    it "should destroy event" do
      delete :destroy, :id => event.id
      expect(response).to be_success
      expect(json["results"]["id"]).to eql(event.id)
      expect(Event.count).to eql(0)
    end
  end
end
