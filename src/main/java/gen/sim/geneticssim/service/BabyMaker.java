
package gen.sim.geneticssim.service;

import gen.sim.geneticssim.entities.Member;
import gen.sim.geneticssim.entities.Trait;
import gen.sim.geneticssim.entities.TraitPackage;
import gen.sim.geneticssim.service.utility.AllTraits;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class BabyMaker {
    public static Member haveAChild(Member father, Member mother) {
        Member member = new Member();
        member.setFather(father);
        member.setMother(mother);
        member.setFounder(false);
        member.setLiving(true);
        member = setDynasties(member, father, mother);
        member = setTraits(member, father, mother);
        return member;
    }

    private static Member setDynasties(Member member, Member father, Member mother) {
        if(father.isMatrilineal()) {
            member.setPrimaryDynasty(mother.getPrimaryDynasty());
            member.addNonprimaryDynasty(father.getPrimaryDynasty());
        }
        else {
            member.setPrimaryDynasty(father.getPrimaryDynasty());
            member.addNonprimaryDynasty(mother.getPrimaryDynasty());
        }
        member = nonPrimaryDynastyConverter(member, father, mother, father.isMatrilineal());
        return member;
    }
    
    private static Member nonPrimaryDynastyConverter(Member member, Member father, Member mother, boolean matrilineal) {
        Member first;
        Member second;
        if(matrilineal) {
            first = mother;
            second = father;
        }
        else {
            first = father;
            second = mother;
        }
        int minCount = Math.min(first.getNonprimaryDynasties().size(), second.getNonprimaryDynasties().size());
        int maxCount = Math.max(first.getNonprimaryDynasties().size(), second.getNonprimaryDynasties().size());
        int count = 0;
        for(int i = 0; i < minCount && i < 4; i++) {
            member.addNonprimaryDynasty(first.getNonprimaryDynasties().get(i));
            member.addNonprimaryDynasty(second.getNonprimaryDynasties().get(i));
            count = (i+1)*2;
        }
        if(count < 8 && minCount < maxCount) {
            Member maxMem;
            if(first.getNonprimaryDynasties().size() == maxCount) {
                maxMem = first;
            }
            else {
                maxMem = second;
            }
            for(int i = count/2; i < maxCount && count < 8; i++, count++) {
                member.addNonprimaryDynasty(maxMem.getNonprimaryDynasties().get(i));
            }
        }
        return member;
    }

    private static Member setTraits(Member member, Member father, Member mother) {
        Map<String, TraitPackage> traits = new HashMap();
        Map<String, TraitPackage> fatherTraits = father.getTraits();
        Map<String, TraitPackage> motherTraits = mother.getTraits();
        List<Trait> allTraits = AllTraits.getAllTraits();
        for(Trait t : allTraits) {
            traits.put(t.getName(), generateChildTraitPackage(t, fatherTraits, motherTraits));
        }
        member.setTraits(traits);
        return member;
    }

    private static TraitPackage generateChildTraitPackage(Trait t, Map<String, TraitPackage> fatherTraits, Map<String, TraitPackage> motherTraits) {
        TraitPackage tp = new TraitPackage();
        tp.setTrait(t);
        String[] vp = new String[4];
        vp[0] = fatherTraits.get(t.getName()).getValue();
        vp[1] = motherTraits.get(t.getName()).getValue();
        Random r = new Random();
        vp[2] = fatherTraits.get(t.getName()).getValuePool()[r.nextInt(4)];
        vp[3] = motherTraits.get(t.getName()).getValuePool()[r.nextInt(4)];
        tp.setValuePool(vp);
        int rand1 = r.nextInt(4);
        String val1 = vp[rand1];
        int rand2 = r.nextInt(4);
        while(rand2 == rand1) {
            rand2 = r.nextInt(4);
        }
        String val2 = vp[rand2];
        for(String s : t.getValues()) {
            if(s.equals(val1)) {
                tp.setValue(val1);
                break;
            }
            else if(s.equals(val2)) {
                tp.setValue(val2);
                break;
            }
        }
        if(t.getName().equals("Sex") && tp.getValue().equals("Male")) {
            int equalizer = r.nextInt(4);
            if(equalizer == 0) {
                tp.setValue("Female");
            }
        }
        else if(!t.getName().equals("Sex")) {
            int mutationChance = r.nextInt(100);
            if(mutationChance >= 95) {
                tp = mutateTrait(tp, r);
            }
        }
        return tp;
    }

    private static TraitPackage mutateTrait(TraitPackage tp, Random r) {
        int wildModChance = r.nextInt(10);
        if(wildModChance < 3) {
            int choice = r.nextInt(tp.getTrait().getValues().size());
            tp.setValue(tp.getTrait().getValues().get(choice));
        }
        else {
            int choice = r.nextInt(4);
            tp.setValue(tp.getValuePool()[choice]);
        }
        return tp;
    }
}
