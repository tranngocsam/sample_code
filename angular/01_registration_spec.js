describe("Register page", function() {
  beforeEach(function() {
    ptor = protractor.getInstance();
    ptor.manage().deleteAllCookies();
    browser.get("/register");
  });

  it("should have register form", function() {
    expect(element(by.model("customer.email")).getAttribute("type")).toBe("text");
    expect(element(by.model("customer.password")).getAttribute("type")).toBe("password");
    expect(element(by.css("[type='submit']")).isPresent()).toBe(true);
  });

  it("should have integrated social providers", function() {
    expect(element(by.css(".register-social .icon-facebook")).isPresent()).toBe(true);
    expect(element(by.css(".register-social .icon-twitter")).isPresent()).toBe(true);
    expect(element(by.css(".register-social .icon-google")).isPresent()).toBe(true);
  });

  it("should disable submit button", function() {
    expect(element(by.css("[type='submit']")).isEnabled()).toBe(false);
  })

  it("should enable submit button when user fill in valid email and valid password", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.email")).sendKeys("a_valid_email@yahoo.com")
    element(by.model("customer.password")).sendKeys("Test1234")
    expect(element(by.css("[type='submit']")).isEnabled()).toBe(true);
  });

  it("should display error when user fills in invalid email", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.email")).sendKeys("an invalid_email@yahoo.com");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("not a valid e-mail address") >= 0).toBe(true);
    });
    expect(element(by.css("[type='submit']")).isEnabled()).toBe(false);
  });

  it("should display green check mark when user fill in valid email", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.email")).sendKeys("a_valid_email@yahoo.com");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("not a valid e-mail address") >= 0).toBe(false);
      expect(text.indexOf("Good to go") >= 0).toBe(true);
    });
  });

  it("should display error when user fills in password below 8 characters", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.password")).sendKeys("Abc123!");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("Password must be at least 8 characters long") >= 0).toBe(true);
    });
  });

  it("should display error when user fills in password without uppercase", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.password")).sendKeys("abc12345");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("Password must have at least one uppercase letter") >= 0).toBe(true);
    });
  });

  it("should display error when user fills in password without lowercase", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.password")).sendKeys("ABC12345");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("Password must have at least one lowercase letter") >= 0).toBe(true);
    });
  });

  it("should display green text when user fills in password with uppercase and lowercase", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.password")).sendKeys("Abc12345");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("You can do better by adding a special character") >= 0).toBe(true);
    });
  });

  it("should display green 'Perfect!' text when user fills in password with uppercase and lowercase and one special character", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.password")).sendKeys("Abc12345!");
    element(by.css("form")).getText().then(function(text) {
      expect(text.indexOf("Perfect!") >= 0).toBe(true);
    });
  });

  it("should allow user to register with valid email and password", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.email")).sendKeys("a_valid_email@yahoo.com")
    element(by.model("customer.password")).sendKeys("Test1234")
    element(by.css("[type='submit']")).click().then(function() {
      browser.waitForAngular().then(function() {
        browser.getLocationAbsUrl().then(function(text) {
          expect(text.indexOf("/register/address") >= 0).toBe(true);
        });
      });
    });
  });

  it("should not allow user to register with already registered email", function() {
    browser.executeScript("window.scroll(0, 200)");

    element(by.model("customer.email")).sendKeys("another_valid_email@yahoo.com");
    element(by.model("customer.password")).sendKeys("Test1234");
    element(by.css("[type='submit']")).click().then(function() {
      browser.waitForAngular().then(function() {
        browser.sleep(1000).then(function() {
          browser.getLocationAbsUrl().then(function(text) {
            expect(text.indexOf("/register/address") >= 0).toBe(true);
            browser.get("/customers/sign_out");
            browser.get("/register");

            browser.executeScript("window.scroll(0, 200)");
            element(by.model("customer.email")).sendKeys("another_valid_email@yahoo.com");
            browser.sleep(1000).then(function() {
              browser.waitForAngular().then(function() {
                element(by.css("form")).getText().then(function(text) {
                  expect(text).toMatch("That e-mail has been registered.");
                });            
              });
            });
          });
        });
      });
    });
  });

  it("should allow to register using facebook", function() {
    element(by.css(".register-social .icon-facebook")).click().then(function() {
      browser.sleep(1000);
      browser.driver.findElement(protractor.By.css("#email")).sendKeys("linh.tinh.developer@gmail.com");
      browser.driver.findElement(protractor.By.css("#pass")).sendKeys("voyeudau");
      browser.driver.findElement(protractor.By.css("#login_form [type='submit']")).click();
    });
    element(by.css("#avatar")).getText().then(function(text) {
      expect(text).toMatch(/log out/i);
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch("/register/address");
      });
    });
  });

  it("should require to register email when using twitter", function() {
    element(by.css(".register-social .icon-twitter")).click().then(function() {
      browser.sleep(1000);
      browser.driver.findElement(protractor.By.css("#username_or_email")).sendKeys("linh.tinh.developer@gmail.com");
      browser.driver.findElement(protractor.By.css("#password")).sendKeys("voyeudau");
      browser.driver.findElement(protractor.By.css("#oauth_form [type='submit']")).click().then(function() {
        browser.sleep(5000);
      });
    });
    element(by.css("#avatar")).getText().then(function(text) {
      expect(text).toMatch(/log out/i);
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch("/register/email");
      });
      expect(element(by.model("currentCustomer.email")).getAttribute("value")).toBe("");
      element(by.model("currentCustomer.email")).sendKeys("linh.tinh@yahoo.com");
      expect(element(by.css("#registration-step-2 input[type='submit']")).isEnabled()).toBe(true);
      element(by.css("#registration-step-2 input[type='submit']")).click();

      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch("/register/address");
      });
    });
  });

  it("should allow to register using google", function() {
    element(by.css(".register-social .icon-google")).click().then(function() {
      browser.sleep(1000);
      browser.driver.findElement(protractor.By.css("#Email")).sendKeys("linh.tinh.developer@gmail.com");
      browser.driver.findElement(protractor.By.css("#Passwd")).sendKeys("voyeudau");
      browser.driver.findElement(protractor.By.css("#gaia_loginform [type='submit']")).click();
    });
    element(by.css("#avatar")).getText().then(function(text) {
      expect(text).toMatch(/log out/i);
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch("/register/address");
      });
    });
  });
});
