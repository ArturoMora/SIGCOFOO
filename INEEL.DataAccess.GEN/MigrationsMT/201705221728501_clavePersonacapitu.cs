namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class clavePersonacapitu : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.Capitulos", "ClavePersona", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("MT.Capitulos", "ClavePersona");
        }
    }
}
