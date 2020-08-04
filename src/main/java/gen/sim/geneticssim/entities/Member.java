
package gen.sim.geneticssim.entities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Member {
    private int memberId;
    private String name;
    private Dynasty primaryDynasty;
    private List<Dynasty> nonprimaryDynasties = new ArrayList();
    private Member spouse;
    private boolean matrilineal;
    private List<Member> children = new ArrayList();
    private Member father;
    private Member mother;
    private Map<String, TraitPackage> traits = new HashMap();
    private List<Member> pastSpouses = new ArrayList();
    private boolean living;
    private boolean founder;

    public Member() {
    }

    public Member(String name, Map<String, TraitPackage> traits, boolean living, boolean founder) {
        this.name = name;
        this.traits = traits;
        this.living = living;
        this.founder = founder;
    }

    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public boolean isFounder() {
        return founder;
    }

    public void setFounder(boolean founder) {
        this.founder = founder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Member getSpouse() {
        return spouse;
    }

    public void setSpouse(Member spouse) {
        this.spouse = spouse;
    }

    public boolean isMatrilineal() {
        return matrilineal;
    }

    public void setMatrilineal(boolean matrilineal) {
        this.matrilineal = matrilineal;
    }

    public List<Member> getChildren() {
        return new ArrayList(children);
    }

    public void setChildren(List<Member> children) {
        this.children = children;
    }

    public Member getFather() {
        return father;
    }

    public void setFather(Member father) {
        this.father = father;
    }

    public Member getMother() {
        return mother;
    }

    public void setMother(Member mother) {
        this.mother = mother;
    }

    public Map<String, TraitPackage> getTraits() {
        return new HashMap(traits);
    }

    public void setTraits(Map<String, TraitPackage> traits) {
        this.traits = traits;
    }

    public List<Member> getPastSpouses() {
        return new ArrayList(pastSpouses);
    }

    public void setPastSpouses(List<Member> pastSpouses) {
        this.pastSpouses = pastSpouses;
    }

    public boolean isLiving() {
        return living;
    }

    public void setLiving(boolean living) {
        this.living = living;
    }

    public Dynasty getPrimaryDynasty() {
        return primaryDynasty;
    }

    public void setPrimaryDynasty(Dynasty primaryDynasty) {
        this.primaryDynasty = primaryDynasty;
    }

    public List<Dynasty> getNonprimaryDynasties() {
        return new ArrayList(nonprimaryDynasties);
    }

    public void setNonprimaryDynasties(List<Dynasty> nonprimaryDynasties) {
        this.nonprimaryDynasties = nonprimaryDynasties;
    }
    
    public void addNonprimaryDynasty(Dynasty dynasty) {
        this.nonprimaryDynasties.add(dynasty);
    }
}
