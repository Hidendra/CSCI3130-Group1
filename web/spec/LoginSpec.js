beforeEach(function() {
    existingUser = jasmine.createSpy("existingUser");    
});

describe("Login", function() {
	it('tries to log in', function (){
        $("#signin").trigger('click');
        expect(existingUser).toHaveBeenCalled();
    });
});