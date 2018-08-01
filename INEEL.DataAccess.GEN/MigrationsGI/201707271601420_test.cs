namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test : DbMigration
    {
        public override void Up()
        {
            //DropPrimaryKey("GI.tab_Propuesta");
            //AddColumn("GI.tab_Propuesta", "Id", c => c.Int(nullable: false, identity: true));
            //AlterColumn("GI.tab_Propuesta", "PropuestaId", c => c.String());
            //AddPrimaryKey("GI.tab_Propuesta", "Id");
        }
        
        public override void Down()
        {
            //DropPrimaryKey("GI.tab_Propuesta");
            //AlterColumn("GI.tab_Propuesta", "PropuestaId", c => c.String(nullable: false, maxLength: 128));
            //DropColumn("GI.tab_Propuesta", "Id");
            //AddPrimaryKey("GI.tab_Propuesta", "PropuestaId");
        }
    }
}
