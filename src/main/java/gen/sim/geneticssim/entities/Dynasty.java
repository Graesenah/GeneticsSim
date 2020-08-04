
package gen.sim.geneticssim.entities;

import java.util.ArrayList;
import java.util.List;

public class Dynasty {
    
    private String name;
    private int crestType;
    private int crestDesign;
    private int[] primary;
    private int[] secondary;
    private List<Member> primaryMembers = new ArrayList();
    private List<Member> allMembers = new ArrayList();
    private Member founder;

    public Dynasty() {
    }

    public Dynasty(String name, int crestType, int crestDesign, Member founder) {
        this.name = name;
        this.crestType = crestType;
        this.crestDesign = crestDesign;
        this.founder = founder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCrestType() {
        return crestType;
    }

    public void setCrestType(int crestType) {
        this.crestType = crestType;
    }

    public int getCrestDesign() {
        return crestDesign;
    }

    public void setCrestDesign(int crestDesign) {
        this.crestDesign = crestDesign;
    }

    public int[] getPrimary() {
        return primary;
    }

    public void setPrimary(int[] primary) {
        this.primary = primary;
    }

    public int[] getSecondary() {
        return secondary;
    }

    public void setSecondary(int[] secondary) {
        this.secondary = secondary;
    }

    public List<Member> getPrimaryMembers() {
        return new ArrayList(primaryMembers);
    }

    public void setPrimaryMembers(List<Member> primaryMembers) {
        this.primaryMembers = primaryMembers;
    }
    
    public void addPrimaryMember(Member member) {
        primaryMembers.add(member);
    }

    public List<Member> getAllMembers() {
        return new ArrayList(allMembers);
    }

    public void setAllMembers(List<Member> allMembers) {
        this.allMembers = allMembers;
    }
    
    public void addMember(Member member) {
        allMembers.add(member);
    }

    public Member getFounder() {
        return founder;
    }

    public void setFounder(Member founder) {
        this.founder = founder;
    }
}
