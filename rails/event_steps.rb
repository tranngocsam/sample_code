include EventsHelper

Given /^a "([^"]*)" event in (next|past) (\d+) day(?:s?) with a photographer$/ do |listing_type, tense, number|
  @user ||= FactoryGirl.create(:user)
  if @photographer.nil?
    @photographer = FactoryGirl.build(:photographer)
    if User.where(:email => @photographer.email).count > 0
      @photographer = User.find_by_username_or_email(@photographer.username)
    else
      @photographer.save!
    end
  end
  venue = FactoryGirl.create(:venue, :user_id => @user.id.to_s)
  if tense == "next"
    @party = FactoryGirl.build(:party, :listing_type => listing_type, :user_id => @user.id.to_s, :next_date => Date.today + number.to_i.day, :venue_id => venue.id)
    @party.photographer_list_string = @photographer.username
    @party.save!
    @event = @party.current_event
  else
    Timecop.freeze(number.to_i.day.ago) do
      @party = FactoryGirl.build(:party, :listing_type => listing_type, :user_id => @user.id.to_s, :next_date => Date.today, :venue_id => venue.id)
      @party.photographer_list_string = @photographer.username
      @party.save!
      @event = @party.current_event
    end
  end
end

Given /^(\d+) "([^"]*)" event(?:s?) in (next|past) (\d+) day(?:s?) with a photographer$/ do |number_events, listing_type, tense, number|
  @user ||= FactoryGirl.create(:user)
  @photographer ||= FactoryGirl.create(:photographer)
  venue = FactoryGirl.create(:venue, :user_id => @user.id.to_s)
  @events ||= []
  number_events.to_i.times.each do 
    if tense == "next"
      @party = FactoryGirl.build(:party, :listing_type => listing_type, :user_id => @user.id.to_s, :next_date => Date.today + number.to_i.day, :venue_id => venue.id)
      @party.photographer_list_string = @photographer.username
      @party.save!
      @events << @party.current_event
    else
      Timecop.freeze(number.to_i.day.ago) do
        @party = FactoryGirl.build(:party, :listing_type => listing_type, :user_id => @user.id.to_s, :next_date => Date.today, :venue_id => venue.id)
        @party.photographer_list_string = @photographer.username
        @party.save!
        @events << @party.current_event
      end
    end
  end
end

And /^each event has (\d+) (flyer|flyers|image|images)$/ do |number, image_type|
  @events.each do |event|
    if image_type == "flyer" || image_type == "flyers"
      flyer_album = FactoryGirl.create(:album, :record => event.to_record, :user_id => event.user_id, :image_type => "flyers")
      number.to_i.times.each do |n|
        FactoryGirl.create(:image, :album_id => flyer_album.id, :user_id => event.user_id)
      end
    else
      if event.date < Date.today
        album = FactoryGirl.create(:album, :record => event.to_record, :user_id => event.user_id, :image_type => "photos")
        number.to_i.times.each do |n|
          FactoryGirl.create(:image, :album_id => album.id, :user_id => event.user_id)
        end
      end
    end
  end
end

Given /^the following events:$/ do |events|
  Event.create!(events.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) event$/ do |pos|
  visit events_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Destroy"
  end
end

Then /^I should see the following events:$/ do |expected_events_table|
  expected_events_table.diff!(tableish('table tr', 'td,th'))
end

Then /^I should see the event details$/ do
  page.should have_content(@event.title)
  page.should have_content(@event.venue_cache[:name])
  page.should have_content(event_start_date(@event))
  page.should have_content(event_time_period(@event))
  page.should have_content(@event.venue_cache[:phone])
  page.should have_content(@event.description)
  page.should have_content(@event.music)
  page.should have_content(@event.host)
  page.should have_content(@event.dj)
end

And /^I should see a map of venue address$/ do
  page.should have_selector("#map_canvas div")
end

And /^I should see rsvp button$/ do
  page.should have_selector(:css, "nav.buttons a.rsvp")
end

And /^I should see Buy Tickets button$/ do
  page.should have_selector(:css, "nav.buttons a.buy-tickets")
end

Then /^I should see event's album$/ do
  page.should have_selector(".album img")
end

Then /^I should see the name and image of the event creator$/ do
  # user = User.find(@event.user_id)
  profile_image = @user.avatar? ? @user.avatar.profile.url : SCENESTR.img[:missing]['thumb']
  page.should have_selector(:css, ".owner :contains('#{@user.display_name}')")
  page.should have_selector(:css, "img[src^='#{profile_image}']")
end

Then /^I should see the name and image of the photographers$/ do
  Array.wrap(@photographer).each do |photographer|
    profile_image = photographer.avatar? ? photographer.avatar.profile.url : SCENESTR.img[:missing]['thumb']
    page.should have_selector(:css, ".photographer :contains('#{photographer.display_name}')")
    page.should have_selector(:css, "img[src^='#{profile_image}']")
  end
end

Then /^I should see other people name and profile who will come to the event$/ do
  pending 
end

################# Test edit event page ################################

Given /^the event has (\d+) flyers$/ do |number|
  # @event = Event.last
  flyer_album_id = @event.flyer_album_id

  if flyer_album_id.blank?
    flyer_album = FactoryGirl.create(:album, :image_type => "flyers", :user_id => @event.user_id)
    flyer_album_id = flyer_album.id
    @event.flyer_album_id = flyer_album_id
    @event.save
  end

  number.to_i.times do
    image = FactoryGirl.create(:image, :album_id => flyer_album_id, :user_id => @event.user_id)
    image.save 
  end
end

And /^I log in as event owner$/ do
  @event ||= Event.last
  @user = User.find(@event.user_id)
  visit login_user_path(@user)
end

When /^I go to edit event page$/ do
  visit edit_party_path(@event.party) 
end

Then /^I should see event form with filled in data$/ do
  find(:css, "input[name='party[title]']").value.should == @event.title
  find(:css, "input[name='party[venue_name]']").value.should == @event.venue_name
  find(:css, "input[name='party[venue_id]']").value.should == @event.venue_cache["id"]
  find(:css, "input[name='party[next_date]']").value.should == @event.date.strftime("%Y-%m-%d")
  find(:css, "input[name='party[start_time]']").value.should == @event.start_time
  find(:css, "input[name='party[end_time]']").value.should == @event.end_time
  find(:css, "textarea").value.should == @event.description
  page.should have_selector("input[type='file']")
  page.should have_content("Select Flyer")
end

And /^I should see (\d+) uploaded (flyers|photos)$/ do |number, image_type|
  page.should have_selector(".files .preview img", :count => number)
end

Then /^I should go to the newly updated event$/ do
  page.current_path.should == event_path(@event)
end

Then /^I should not be on the edit event page$/ do
  page.current_path.should_not == edit_event_path(@event)
end

Then /^it should set new value for hidden venue_id field$/ do
  venue = Venue.find(:first, :conditions => {:name => find(:css, "input[name*='venue_name']").value})
  find(:css, "input[name*='venue_id']").value.should == venue.id.to_s
end

Then /^it should show me the event show page$/ do
  (page.current_path =~ /events\/.{24}$/).should be_true
end

Given /^the event has one (.+) album with (\d+) images$/ do |image_type, number|
  @event ||= Event.last
  @user = User.find(@event.user_id)

  if image_type == "photos"
    if @event.photo_album_id.blank?
      album = FactoryGirl.create(:album, :record => @event.to_record, :image_type => "photos", :user_id => @user.id.to_s)
      #@event.update_attribute(:photo_album_id, album.id.to_s)
    else
      album = Album.find(@event.photo_album_id)
    end
  else
    if @event.flyer_album_id.blank?
      album = FactoryGirl.create(:album, :record => @event.to_record, :image_type => "flyers", :user_id => @user.id.to_s)
      #@event.update_attribute(:flyer_album_id, album.id.to_s)
    else
      album = Album.find(@event.flyer_album_id)
    end
  end

  number.to_i.times do |i|
    image = FactoryGirl.create(:image, :album_id => album.id.to_s, :orphaned => false, :user_id => @user.id.to_s)
  end

  @event = @event.reload
end

Then /^I should see one flyer as the default image$/ do
  selectors = []
  Image.find(:all, :conditions => {:album_id => @event.flyer_album_id}).each do |flyer|
    selectors << "//*[contains(@class, 'album')]//img[contains(@src, '#{flyer.urls.thumb.url}')]"
  end

  page.should have_selector(:xpath, selectors.join(" | "))
end

And /^I should see (\d+) thumbnails$/ do |number|
  if number.to_i == 0
    page.should_not have_selector(".thumbnails img", :visible => true)
  else
    page.should have_selector(".thumbnails img", :visible => true, :count => number.to_i)
  end
end

And /^I should see the 2 flyers as the first thumbnails$/ do
  urls = []
  Image.find(:all, :conditions => {:album_id => @event.flyer_album_id}).each do |flyer|
    urls << flyer.urls.thumb.url
  end

  page.should have_selector(:xpath, "//*[contains(@class, 'thumbnails')]//li[1]//img[contains(@src, '#{urls.first}')] | //*[contains(@class, 'thumbnails')]//li[1]//img[contains(@src, '#{urls.last}')]")
  page.should have_selector(:xpath, "//*[contains(@class, 'thumbnails')]//li[2]//img[contains(@src, '#{urls.first}')] | //*[contains(@class, 'thumbnails')]//li[2]//img[contains(@src, '#{urls.last}')]")
end

And /^I should see (\d+) pagination links$/ do |number|
  number.to_i.times do |i|
    page.should have_selector(".paginator a:contains('#{i + 1}')")
  end
end

When /^I click the second pagination link$/ do
  find(".paginator a:last").click()
end

Then /^I should see "([^"]*)" button$/ do |button|
  page.should have_selector("button:contains('#{button}')")
end

When /^I click the "([^"]*)" button$/ do |button|
  find(:css, "button:contains('#{button}')").click
end

Then /^I should see "([^"]*)" tab$/ do |tab|
  page.should have_selector("[data-tabs] li :contains('#{tab}')")
end
    
Then /^I should see uploaded image as the (first|last) thumbnail$/ do |order|
  image ||= @images.last
  # Because cloudinary does not keep file name, so we can only check the existence of image.
  page.should have_selector("ul.thumbnails li:#{order}-child img")
end

Then /^I should not see "([^"]*)" tab$/ do |tab|
  page.should_not have_selector("[data-tabs] li :contains('#{tab}')", :visible => true)
end

Then /^I should see (\d+) event(?:s?) listed$/ do |number|
  unless number.to_i == 0
    page.should have_selector(".object-frame", :count => number.to_i)
  else
    page.should_not have_selector(".object-frame")
  end
end

And /^I should see details of each (upcoming|past|mine) event$/ do |type|
  check_events(type)
end

And /^I should see like and bookmark links of each (mine|past|upcoming) event$/ do |type|
  @events.each do |event|
    if (type == "upcoming" && event.date > Date.today || 
        type == "past" && event.date < Date.today ||
        type == "mine" && event.user_id == @user.id.to_s)
      page.should have_selector("#event_#{event.id.to_s} .like")
      page.should have_selector("#event_#{event.id.to_s} .bookmark")
    end
  end
end

And /^I should see "(upcoming|past|my)" is selected$/ do |type|
  page.find(".event_type .type").text.upcase.should == type.upcase
end

When /^I select (mine|past|upcoming|anytime|past-24-hours|past-1-week|past-2-weeks|past-1-month|past-1-year) (events|albums)$/ do |type, object|
  visit("/#{object}#type=#{type}")
end

Then /^I should see event as "([^"]*)"$/ do |text|
  page.should have_selector(".like:contains('#{text}')")
end

def check_events(type)
  @events.each do |event|
    if (type == "upcoming" && event.date > Date.today || 
        type == "past" && event.date < Date.today ||
        type == "mine" && event.user_id == @user.id.to_s)
      check_event(event.reload)
    end
  end
end

def check_event(event)
  page.should have_selector("a:contains('#{event.title[0..20]}')")
  unless event.cover_image.nil?
    cover_url = event.cover_image.urls.thumb
  else
    cover_url = "missing/picture"
  end
  
  page.should have_selector("#event_#{event.id.to_s} .cover img")
  page.should have_selector(".month:contains('#{event.date.strftime("%^b")}')")
  page.should have_selector(".day:contains('#{event.date.day}')")
  page.should have_selector("#event_#{event.id.to_s} :contains('#{event_time_period(event)}')")
  page.should have_selector("#event_#{event.id.to_s} :contains('#{event.music}')")
  page.should have_selector("#event_#{event.id.to_s} :contains('#{event.full_address}')")
  owner = User.find(event.user_id)
  page.should have_selector("#event_#{event.id.to_s} a[href *= '#{profile_path(owner.username)}']")
  
  flyer_album = event.flyer_album
  album = event.photo_album
  thumbnails_count = 0
  thumbnails_count = flyer_album.owner_image_count unless flyer_album.nil?
  thumbnails_count += album.owner_image_count + album.user_submitted_image_count unless album.nil?
  thumbnails_count -= 1 unless thumbnails_count == 0
  thumbnails_count == 3 if thumbnails_count > 3
  
  if thumbnails_count > 0
    page.should have_selector("#event_#{event.id.to_s} .thumbnails img", :count => thumbnails_count)
  end

  if event.date > Date.today
    if event.listing_type == "premium"
      page.should have_selector("#event_#{event.id.to_s} img[src*='/premium_ribbon.png']")
    elsif event.listing_type == "exclusive"
      page.should have_selector("#event_#{event.id.to_s} .#{event.listing_type}")
      page.should have_selector("#event_#{event.id.to_s} img[src*='/exclusive_ribbon.png']")
    else
      page.should have_selector("#event_#{event.id.to_s} .#{event.listing_type}")
    end
  end
end
