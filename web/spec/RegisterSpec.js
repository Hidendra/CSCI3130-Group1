beforeEach(function() {
    newUser = jasmine.createSpy("newUser");    
});

describe("Register", function() {
	it('tries to register', function (){
        $("#signup").trigger('click');
        expect(newUser).toHaveBeenCalled();
    });

});