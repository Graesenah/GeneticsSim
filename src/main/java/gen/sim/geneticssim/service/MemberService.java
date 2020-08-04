
package gen.sim.geneticssim.service;

import gen.sim.geneticssim.data.DynastyDao;
import gen.sim.geneticssim.data.MemberDao;
import gen.sim.geneticssim.data.TraitDao;
import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    @Autowired
    MemberDao md;
    
    @Autowired
    DynastyDao dd;
    
    @Autowired
    TraitDao td;
    
    public MemberService() {
    }
    
    public Member addFounder(Member founder) {
        founder = md.addFounder(founder);
        return founder;
    }

    public void populateMembersForDynastyDisplay(Dynasty dynasty) {
        Member founder = dynasty.getFounder();
        founder = retrieveMemberInfo(founder.getMemberId());
        populateMemberForDynDisplay(founder, dynasty);
        dynasty.setFounder(founder);
    }
    
    private void populateMemberForDynDisplay(Member member, Dynasty dynasty) {
        if(member.getSpouse() != null) {
            member.setSpouse(retrieveMemberInfo(member.getSpouse().getMemberId()));
        }
        if(member.getFather() != null) {
            member.setFather(retrieveMemberInfo(member.getFather().getMemberId()));
        }
        if(member.getMother() != null) {
            member.setMother(retrieveMemberInfo(member.getMother().getMemberId()));
        }
        if(member.getPastSpouses().size() > 0) {
            List<Member> pastSpouses = new ArrayList();
            for(Member ps : member.getPastSpouses()) {
                pastSpouses.add(retrieveMemberInfo(ps.getMemberId()));
            }
            member.setPastSpouses(pastSpouses);
        }
        if(member.getChildren().size() > 0) {
            List<Member> children = new ArrayList();
            for(Member c : member.getChildren()) {
                children.add(retrieveMemberInfo(c.getMemberId()));
            }
            for(int i = 0; i < children.size(); i++) {
                if(children.get(i).getPrimaryDynasty().getName().equals(dynasty.getName())) {
                    populateMemberForDynDisplay(children.get(i), dynasty);
                }
            }
            member.setChildren(children);
        }
    }

    public Member retrieveMemberInfo(int memberId) {
        Member member = md.retrieveMemberInfo(memberId, true);
        td.retrieveMemberTraits(member);
        dd.headlineMemberDynastyInfo(member);
        return member;
    }

    public void arrangeMarriage(int maleId, int femaleId, boolean matrilineal) {
        md.arrangeMarriage(maleId, femaleId, matrilineal);
    }

    public void saveChild(Member child) {
        md.saveChild(child);
    }

    Member getSpouseInfo(Member c) {
        c.setSpouse(md.getCurrentSpouse(c.getMemberId()));
        c.setPastSpouses(md.getPastSpouses(c.getMemberId()));
        return c;
    }
}
