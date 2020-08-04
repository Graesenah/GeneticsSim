
package gen.sim.geneticssim.controllers;

import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import gen.sim.geneticssim.entities.Trait;
import gen.sim.geneticssim.service.BabyMaker;
import gen.sim.geneticssim.service.DynastyService;
import gen.sim.geneticssim.service.MemberLogic;
import gen.sim.geneticssim.service.MemberService;
import gen.sim.geneticssim.service.TraitService;
import gen.sim.geneticssim.service.utility.AllTraits;
import gen.sim.geneticssim.service.utility.NameGenerator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/GenSim")
@CrossOrigin
public class MainController {
    
    @Autowired
    MemberLogic ml;
    
    @Autowired
    TraitService ts;
    
    @Autowired
    DynastyService ds;
    
    @Autowired
    MemberService ms;
    
    private boolean setup = false;

    public MainController() {
    }
    
    @GetMapping("/load")
    public void runSetup() {
        if(!setup) {
            NameGenerator.populateNames();
            ts.populateAllTraits();
            setup = true;
        }
    }
    
    @GetMapping("/random-founder")
    public ResponseEntity<Member> createRandomFounder() {
        Member member = ml.createRandomMember();
        return new ResponseEntity(member, HttpStatus.OK);
    }
    
    @PostMapping("/new-dynasty")
    public void createNewDynasty(@RequestBody Dynasty dynasty) {
        ds.addNewDynasty(dynasty);
    }
    
    @GetMapping("/dynasty-selector")
    public ResponseEntity<List<Dynasty>> dynastySelectorOpen() {
        List<Dynasty> dynasties = ds.getAllDynasties();
        return new ResponseEntity(dynasties, HttpStatus.OK);
    }
    
    @PostMapping("/dynasty-selector-search")
    public ResponseEntity<List<Dynasty>> dynastySelectorSearch(@RequestBody String search) {
        List<Dynasty> dynasties = ds.getSearchDynasties(search);
        return new ResponseEntity(dynasties, HttpStatus.OK);
    }
    
    @PostMapping("/dynasty-selector-select")
    public ResponseEntity<Dynasty> dynastySelectorSelect(@RequestBody String dynName) {
        Dynasty dynasty = ds.getDynastyByName(dynName);
        return new ResponseEntity(dynasty, HttpStatus.OK);
    }
    
    @PostMapping("/full-member")
    public ResponseEntity<Member> memberInfoRetrieval(@RequestBody int memberId) {
        Member member = ms.retrieveMemberInfo(memberId);
        return new ResponseEntity(member, HttpStatus.OK);
    }
    
    @GetMapping("/marriage-options/{memberId}/{incestThreshold}")
    public ResponseEntity<List<Member>> getMarriageOptions(@PathVariable int memberId, @PathVariable int incestThreshold) {
        List<Member> options = ml.getMarriageOptions(memberId, incestThreshold);
        return new ResponseEntity(options, HttpStatus.OK);
    }
    
    @PostMapping("arrange-marriage/{maleId}/{femaleId}")
    public void arrangeMarriage(@PathVariable int maleId, @PathVariable int femaleId, @RequestBody boolean matrilineal) {
        ms.arrangeMarriage(maleId, femaleId, matrilineal);
    }
    
    @PostMapping("update-dynasty-display")
    public ResponseEntity<Dynasty> updateDynastyDisplay(@RequestBody Dynasty dynasty) {
        dynasty = ds.getDynastyByName(dynasty.getName());
        return new ResponseEntity(dynasty, HttpStatus.OK);
    }
    
    @GetMapping("have-child/{memberId}")
    public ResponseEntity<Member> haveChild(@PathVariable int memberId) {
        Member m1 = ms.retrieveMemberInfo(memberId);
        Member m2 = ms.retrieveMemberInfo(m1.getSpouse().getMemberId());
        Member father;
        Member mother;
        if(m1.getTraits().get("Sex").getValue().equals("Male")) {
            father = m1;
            mother = m2;
        }
        else {
            father = m2;
            mother = m1;
        }
        Member child = BabyMaker.haveAChild(father, mother);
        return new ResponseEntity(child, HttpStatus.OK);
    }
    
    @PostMapping("get-random-name")
    public ResponseEntity<Member> getRandomName(@RequestBody String sex) {
        String name = "";
        if(sex.equals("male")) {
            name = NameGenerator.generateMaleName();
        }
        else {
            name = NameGenerator.generateFemaleName();
        }
        Member m = new Member();
        m.setName(name);
        return new ResponseEntity(m, HttpStatus.OK);
    } 
    
    @PostMapping("save-child")
    public void saveChild(@RequestBody Member child) {
        ms.saveChild(child);
    }
    
    @GetMapping("get-all-traits")
    public ResponseEntity<List<Trait>> getAllTraits() {
        return new ResponseEntity(AllTraits.getAllTraits(), HttpStatus.OK);
    }
}
