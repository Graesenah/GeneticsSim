
package gen.sim.geneticssim.data;

import gen.sim.geneticssim.entities.Member;
import java.util.List;

public interface MemberDao {
    public Member addFounder(Member founder);

    public Member populateMemberForDynastyDisplay(Member m, Boolean firstPass);

    public Member retrieveMemberInfo(int memberId, Boolean firstPass);

    public List<Member> getMarriageOptions(Member toMarry);

    public void arrangeMarriage(int maleId, int femaleId, boolean matrilineal);

    public void saveChild(Member child);

    public Member getCurrentSpouse(int memberId);

    public List<Member> getPastSpouses(int memberId);
}
