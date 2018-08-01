namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgregeCampoClavePersona : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Expertos", "ClavePersona", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            DropColumn("CR.cat_Expertos", "ClavePersona");
        }
    }
}
