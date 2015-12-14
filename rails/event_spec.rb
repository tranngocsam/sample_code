require 'rails_helper'

describe Event do
  let(:event) {FactoryGirl.create(:event)}
  context "validations" do
    it "should create event with all attributes" do
      event = Event.create(:name => Faker::Name.name, :description => Faker::Lorem.sentence)
      expect(event).to be_persisted
    end

    it "should not create without name" do
      event = Event.create(:description => Faker::Lorem.sentence)
      expect(event.errors).not_to be_blank
      expect(event.errors[:name]).not_to be_blank
    end

    it "should set status as active by default" do
      expect(event.status).to eql("active")
    end
  end

  describe "#invites_total" do
    it "should return correct number of invites" do
      count1 = rand(10)
      count1 = 1 if count1 == 0
      FactoryGirl.create_list(:invite, count1, :event => event, :code => Faker::Name.name.gsub(/\s+/, ""))

      count2 = rand(10)
      count2 = 1 if count2 == 0
      FactoryGirl.create_list(:invite, count2, :event => event, :customer_id => event.id, :code => Faker::Name.name.gsub(/\s+/, ""))

      expect(event.invites_total).to eql(count1 + count2)
    end
  end

  describe "#used_invites_total" do
    it "should return correct number of used invites" do
      count1 = rand(10)
      count1 = 1 if count1 == 0
      FactoryGirl.create_list(:invite, count1, :event => event, :code => Faker::Name.name.gsub(/\s+/, ""))

      count2 = rand(10)
      count2 = 1 if count2 == 0
      FactoryGirl.create_list(:invite, count2, :event => event, :customer_id => event.id, :code => Faker::Name.name.gsub(/\s+/, ""))

      expect(event.used_invites_total).to eql(count2)
    end
  end

  describe "#as_json" do
    it "should include invites_total and used_invites_total" do
      count1 = rand(10)
      count1 = 1 if count1 == 0
      FactoryGirl.create_list(:invite, count1, :event => event, :code => Faker::Name.name.gsub(/\s+/, ""))

      count2 = rand(10)
      count2 = 1 if count2 == 0
      FactoryGirl.create_list(:invite, count2, :event => event, :customer_id => event.id, :code => Faker::Name.name.gsub(/\s+/, ""))

      expect(event.as_json["invites_total"]).to eql(count1 + count2)
      expect(event.as_json["used_invites_total"]).to eql(count2)
    end
  end

  describe "#save_codes" do
    it "should create invites for event" do
      codes = Event.generate_codes("AAAA-1111", 2)
      expect(codes.length).to eql(2)
      event.save_codes(codes)
      expect(event.invites_total).to eql(codes.length)
    end
  end

  describe ".generate_code" do
    it "should generate correct format" do
      format = "AAA-111"
      code = Event.generate_code(format)

      expect(code.split("-")[0].match(/[^a-z]/i)).to be_blank
      expect(code.split("-")[0]).not_to eql("AAA")

      expect(code.split("-")[1].match(/[^\d]/i)).to be_blank
      expect(code.split("-")[1]).not_to eql("111")

      format = "AA11-11AA"
      code = Event.generate_code(format)

      expect(code[0].match(/[^a-z]/i)).to be_blank
      expect(code[1].match(/[^a-z]/i)).to be_blank
      expect(code[2].match(/[^\d]/i)).to be_blank
      expect(code[3].match(/[^\d]/i)).to be_blank
      expect(code[4]).to eql("-")
      expect(code[5].match(/[^\d]/i)).to be_blank
      expect(code[6].match(/[^\d]/i)).to be_blank
      expect(code[7].match(/[^a-z]/i)).to be_blank
      expect(code[8].match(/[^a-z]/i)).to be_blank

      format = '"Changelane"-A11A-1AA1'
      code = Event.generate_code(format)

      expect(code[0..9]).to eql("Changelane")
      expect(code[10]).to eql("-")
      expect(code[11].match(/[^a-z]/i)).to be_blank
      expect(code[12].match(/[^\d]/i)).to be_blank
      expect(code[13].match(/[^\d]/i)).to be_blank
      expect(code[14].match(/[^a-z]/i)).to be_blank
      expect(code[15]).to eql("-")
      expect(code[16].match(/[^\d]/i)).to be_blank
      expect(code[17].match(/[^a-z]/i)).to be_blank
      expect(code[18].match(/[^a-z]/i)).to be_blank
      expect(code[19].match(/[^\d]/i)).to be_blank
    end
  end

  describe ".generate_codes" do
    it "should generate the correct number of code" do
      format = "1A1A-1A1A"
      number = rand(10)
      number = 1 if number == 0

      expect(Event).to receive(:generate_code).with(format).exactly(number).times
      codes = Event.generate_codes(format, number)
      expect(codes.length).to eql(number)
    end
  end
end
