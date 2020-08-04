
package gen.sim.geneticssim.service;

import gen.sim.geneticssim.data.MemberDao;
import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import gen.sim.geneticssim.entities.Trait;
import gen.sim.geneticssim.entities.TraitPackage;
import gen.sim.geneticssim.service.utility.AllTraits;
import gen.sim.geneticssim.service.utility.NameGenerator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberLogic {
    
    @Autowired
    MemberService ms;
    
    @Autowired
    MemberDao md;
    
    public MemberLogic() {
    }
    
    public Member createRandomMember() {
        Member member = new Member();
        Map<String, TraitPackage> traits = new HashMap();
        List<Trait> allTraits = AllTraits.getAllTraits();
        for(Trait t : allTraits) {
            TraitPackage tp = generateRandomTraitPackage(t);
            traits.put(t.getName(), tp);
        }
        member.setTraits(traits);
        member.setLiving(true);
        member.setName(getRandomName(member));
        member.setChildren(new ArrayList());
        member.setNonprimaryDynasties(new ArrayList());
        member.setPastSpouses(new ArrayList());
        return member;
    }
    
    private TraitPackage generateRandomTraitPackage(Trait trait) {
        Random r = new Random();
        TraitPackage tp = new TraitPackage(trait);
        String[] vp = new String[4];
        for(int i = 0; i < 4; i++) {
            vp[i] = trait.getValues().get(r.nextInt(trait.getValues().size()));
        }
        tp.setValuePool(vp);
        int first = r.nextInt(4);
        int second = first;
        while(second == first) {
            second = r.nextInt(4);
        }
        String value = null;
        for(String s : trait.getValues()) {
            if(s.equals(vp[first]) || s.equals(vp[second])) {
                value = s;
                break;
            }
        }
        tp.setValue(value);
        if(trait.getName().equals("Sex") && tp.getValue().equals("Male")) {
            int equalizer = r.nextInt(4);
            if(equalizer == 0) {
                tp.setValue("Female");
            }
        }
        return tp;
    }
    
    private String getRandomName(Member member) {
        return NameGenerator.generateName(member);
    }
    
    public List<Member> getMarriageOptions(int memberId, int incestThreshold) {
        Member toMarry = ms.retrieveMemberInfo(memberId);
        List<Member> potOptions = md.getMarriageOptions(toMarry);
        List<Member> options = new ArrayList();
        for(int i = 0; i < potOptions.size(); i++) {
            Member option = potOptions.get(i);
            option = ms.retrieveMemberInfo(option.getMemberId());
            boolean match = true;
            if(option.getTraits().get("Sex").getValue().equals(toMarry.getTraits().get("Sex").getValue())) {
                match = false;
            }
            for(Dynasty d : option.getNonprimaryDynasties()) {
                if(d.getName().equals(toMarry.getPrimaryDynasty().getName())) {
                    match = false;
                }
            }
            for(Dynasty d : toMarry.getNonprimaryDynasties()) {
                if(d.getName().equals(option.getPrimaryDynasty().getName())) {
                    match = false;
                }
            }
            if(incestThreshold > 0 && match) {
                for(int j = 0; j < incestThreshold && j < option.getNonprimaryDynasties().size() && j < toMarry.getNonprimaryDynasties().size(); j++) {
                   for(Dynasty d : option.getNonprimaryDynasties()) {
                        if(d.getName().equals(toMarry.getNonprimaryDynasties().get(j).getName())) {
                            match = false;
                            break;
                        }
                    }
                    if(!match) {
                        break;
                    }
                    for(Dynasty d : toMarry.getNonprimaryDynasties()) {
                        if(d.getName().equals(option.getNonprimaryDynasties().get(j).getName())) {
                            match = false;
                            break;
                        }
                    }
                    if(!match) {
                        break;
                    }
                }
            }
            if(match) {
                options.add(option);
            }
        }
        return options;
    }
}
