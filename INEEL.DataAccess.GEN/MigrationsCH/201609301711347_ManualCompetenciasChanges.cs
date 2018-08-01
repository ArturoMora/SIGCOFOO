namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ManualCompetenciasChanges : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("CH.tab_ManualCompetenciaConductual");
            DropPrimaryKey("CH.tab_ManualCompetenciaTecnica");
            AlterColumn("CH.tab_ManualCompetenciaConductual", "ManualCompetenciaConductualId", c => c.Int(nullable: false, identity: true));
            AlterColumn("CH.tab_ManualCompetenciaTecnica", "ManualCompetenciaTecnicaId", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("CH.tab_ManualCompetenciaConductual", "ManualCompetenciaConductualId");
            AddPrimaryKey("CH.tab_ManualCompetenciaTecnica", "ManualCompetenciaTecnicaId");
        }
        
        public override void Down()
        {
            DropPrimaryKey("CH.tab_ManualCompetenciaTecnica");
            DropPrimaryKey("CH.tab_ManualCompetenciaConductual");
            AlterColumn("CH.tab_ManualCompetenciaTecnica", "ManualCompetenciaTecnicaId", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("CH.tab_ManualCompetenciaConductual", "ManualCompetenciaConductualId", c => c.String(nullable: false, maxLength: 128));
            AddPrimaryKey("CH.tab_ManualCompetenciaTecnica", "ManualCompetenciaTecnicaId");
            AddPrimaryKey("CH.tab_ManualCompetenciaConductual", "ManualCompetenciaConductualId");
        }
    }
}
