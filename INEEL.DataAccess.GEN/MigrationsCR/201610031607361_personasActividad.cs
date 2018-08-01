namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class personasActividad : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_PersonalActividadAdicional", "ClavePersona", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_PersonalActividadAdicional", "ClavePersona");
        }
    }
}
