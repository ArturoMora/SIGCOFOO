namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class origenPP : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.PersonalProyecto", "Origen", c => c.String());
        }
        
        public override void Down()
        {
            //DropColumn("GEN.PersonalProyecto", "Origen");
        }
    }
}
