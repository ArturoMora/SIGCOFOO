namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dbsetLog : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_Log",
                c => new
                    {
                        LogId = c.Long(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Thread = c.String(),
                        Level = c.String(),
                        Logger = c.String(),
                        Message = c.String(),
                        Exception = c.String(),
                    })
                .PrimaryKey(t => t.LogId);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.tab_Log");
        }
    }
}
