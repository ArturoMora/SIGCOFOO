namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class clavepersonaevaluadores : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GI.tab_EvaluadoresIdea", "ClavePersona", c => c.String());
        }
        
        public override void Down()
        {
            //DropColumn("GI.tab_EvaluadoresIdea", "ClavePersona");
        }
    }
}
